import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { existsSync } from "node:fs";
import path from "node:path";
import Navbar from "@/components/layout/Navbar";
import ProjectEnquirySection from "@/components/home/ProjectEnquirySection";
import TrustedClientsSection from "@/components/home/TrustedClientsSection";
import JagdambaProjectHero from "@/components/projects/JagdambaProjectHero";
import ProjectOverview from "@/components/projects/ProjectOverview";
import ProjectMediaStory, { type ProjectMediaRecord } from "@/components/projects/ProjectMediaStory";
import ProjectChallenges from "@/components/projects/ProjectChallenges";
import ProjectEngineeringApproach from "@/components/projects/ProjectEngineeringApproach";
import ProjectPlantSystem from "@/components/projects/ProjectPlantSystem";
import ProjectExecutionJourney from "@/components/projects/ProjectExecutionJourney";
import ProjectFinalResult from "@/components/projects/ProjectFinalResult";
import ProjectEngineeringNotes from "@/components/projects/ProjectEngineeringNotes";
import { projectArchive, projects, type Project, type ProjectArchiveRecord, type ProjectMedia } from "@/data/projects";
import { jagdambaProjectChallenges } from "@/data/project-challenges";
import { engineeringExecutionStages } from "@/data/engineering-approach";
import type { ProjectPlantSystemData } from "@/data/project-plant-system";
import type { ProjectExecutionStage } from "@/data/project-execution";
import { engineeringNotes } from "@/data/engineering-notes";
import { createPageMetadata } from "@/config/site";
import "../jagdamba-salt-15tph/project-detail-shell.css";

type ProjectDetailPageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projectArchive.filter((project) => !project.isFeatured).map(({ slug }) => ({ slug }));
}

const sourceForRecord = (record: ProjectArchiveRecord) => projects.find((project) => (
  project.id === record.id || project.client === record.name || project.title === record.name
));

const projectMedia = (record: ProjectArchiveRecord, source?: Project): readonly ProjectMedia[] => (
  source?.media.length ? source.media : [{ id: "field-record", type: record.mediaType, src: record.mediaSrc, label: record.mediaLabel }]
);

const mediaClass = (media: ProjectMedia, index: number) => {
  if (media.id === "overview") return "project-media-record--frame";
  if (media.id === "installation") return "project-media-record--final";
  if (media.id === "fabrication") return "project-media-record--secondary";
  return index === 0 ? "project-media-record--primary" : "project-media-record--final";
};

const sentenceLabel = (label: string) => label.toLowerCase().replace(/^./, (letter) => letter.toUpperCase());

const mediaStoryRecords = (record: ProjectArchiveRecord, source?: Project): readonly ProjectMediaRecord[] => (
  [...projectMedia(record, source)]
    .sort((a, b) => {
      const order: Record<string, number> = { completed: 0, overview: 1, fabrication: 2, installation: 3 };
      return (order[a.id] ?? 10) - (order[b.id] ?? 10);
    })
    .map((media, index) => {
    const common = {
      id: media.id,
      number: String(index + 1).padStart(2, "0"),
      className: mediaClass(media, index),
      src: media.src,
      caption: `${sentenceLabel(media.label)} recorded by S.K. Engineering Works.`,
    };
    return media.type === "video"
      ? { ...common, type: "video" as const, major: media.id === "completed" || media.id === "installation" }
      : { ...common, type: "image" as const, alt: `${record.name} ${media.label.toLowerCase()}` };
    })
);

const executionStages = (record: ProjectArchiveRecord, source?: Project): readonly ProjectExecutionStage[] => (
  projectMedia(record, source).map((media, index) => ({
    id: String(index + 1).padStart(2, "0"),
    title: media.label,
    description: `${sentenceLabel(media.label)} from the verified project media record.`,
    mediaType: media.type,
    mediaSrc: media.src,
    ...(media.type === "video" ? { poster: source?.coverImage ?? record.poster } : {}),
    mediaAlt: `${record.name} ${media.label.toLowerCase()}`,
    layout: (["right", "left", "wide"] as const)[index % 3],
  }))
);

const plantSystemForRecord = (record: ProjectArchiveRecord, source?: Project): ProjectPlantSystemData => {
  const scope = source?.completeScope?.length
    ? source.completeScope
    : source?.scopeChips?.length
      ? source.scopeChips
      : [record.category === "salt-plants" ? "SYSTEM CONFIGURATION" : source?.title ?? record.name];
  const hasPublishedScope = Boolean(source?.completeScope?.length || source?.scopeChips?.length || record.category !== "salt-plants");
  return {
    capacity: record.capacity ?? "PROJECT",
    materialFlow: scope.map((name, index) => ({
      id: String(index + 1).padStart(2, "0"),
      name: name.toUpperCase(),
      role: record.category === "salt-plants"
        ? hasPublishedScope ? "Recorded project scope" : "Verified equipment list not published"
        : "Equipment field record",
      image: scope.length === 1 ? source?.coverImage ?? record.poster ?? (record.mediaType === "image" ? record.mediaSrc : null) : null,
      imageAlt: scope.length === 1 ? `${record.name} equipment view` : "",
    })),
    airHandling: { sourceStageId: "", stages: [] },
  };
};

const splitEquipmentTitle = (name: string): readonly [string, string] => {
  const words = name.split(" ");
  if (words.length === 1) return [name, "FIELD RECORD."];
  const split = Math.ceil(words.length / 2);
  return [words.slice(0, split).join(" "), `${words.slice(split).join(" ")}.`];
};

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projectArchive.find((item) => !item.isFeatured && item.slug === slug);
  return createPageMetadata({
    title: project ? `${project.name} | Project Field Record` : "Project",
    description: project ? `${project.name}${project.location ? `, ${project.location}` : ""}. S.K. Engineering Works project field record.` : "S.K. Engineering Works project field record.",
    path: `/projects/${slug}`,
    image: project?.poster ?? (project?.mediaType === "image" ? project.mediaSrc : undefined),
    index: false,
  });
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const projectIndex = projectArchive.findIndex((item) => !item.isFeatured && item.slug === slug);
  const record = projectArchive[projectIndex];
  if (!record) notFound();

  const source = sourceForRecord(record);
  const media = projectMedia(record, source);
  const records = mediaStoryRecords(record, source);
  const stages = executionStages(record, source);
  const completedMedia = media.find((item) => item.id === "completed") ?? media[media.length - 1];
  const poster = source?.coverImage ?? record.poster ?? (completedMedia.type === "image" ? completedMedia.src : record.mediaSrc);
  const heroFilm = media.find((item) => item.id === "completed" && item.type === "video") ?? media.find((item) => item.type === "video");
  const recordNumber = String(projectIndex + 1).padStart(3, "0");
  const isPlant = record.category === "salt-plants";
  const recordName = record.name.replace(/\.+$/, "");
  const client = isPlant ? record.name : "CLIENT NOT PUBLISHED";
  const location = record.location?.toUpperCase() ?? "PROJECT LOCATION NOT PUBLISHED";
  const capacity = source?.capacity || record.capacity || "NOT PUBLISHED";
  const projectType = source?.projectType?.toUpperCase() ?? (isPlant ? "SALT REFINERY" : "INDUSTRIAL EQUIPMENT");
  const equipmentTitle = splitEquipmentTitle(record.name);
  const titleFirst = isPlant ? capacity : equipmentTitle[0];
  const titleSecond = isPlant ? "SALT REFINERY." : equipmentTitle[1];
  const statement = isPlant ? [capacity, "SALT REFINERY", `FOR ${recordName.toUpperCase()}.`] : [record.name.toUpperCase(), "EQUIPMENT", "FIELD RECORD."];
  const summary = isPlant
    ? `${capacity} salt refinery project for ${recordName}${record.location ? ` in ${record.location}` : ""}.`
    : `A verified fabrication and equipment media record for ${record.name} by S.K. Engineering Works.`;
  const hasLogo = existsSync(path.join(process.cwd(), "public/images/sk-logo.png"));

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar hasLogo={hasLogo} />
      <main id="main" className="project-detail-shell">
        <JagdambaProjectHero
          poster={poster}
          mobilePoster={poster}
          film={heroFilm?.src ?? null}
          imageAlt={`${record.name} project field record`}
          recordNumber={recordNumber}
          client={isPlant ? record.name.toUpperCase() : "EQUIPMENT FIELD RECORD"}
          titleFirst={titleFirst}
          titleSecond={titleSecond}
          location={location}
          metadata={[["CLIENT", client], ["LOCATION", location], ["CAPACITY", capacity], ["PROJECT", projectType]]}
        />
        <ProjectOverview recordNumber={recordNumber} client={client} location={location} capacity={capacity} projectType={projectType} statement={statement} summary={summary} />
        <ProjectMediaStory
          records={records}
          poster={poster}
          projectLabel={`${record.name.toUpperCase()}${record.location ? ` / ${record.location.toUpperCase()}` : ""}`}
          summary={`Verified ${records.length > 1 ? "media records" : "media record"} from ${recordName}.`}
          recordNumber={recordNumber}
        />
        <ProjectChallenges
          sectionNumber="04"
          heading={["EVERY SITE", "SETS ITS OWN", "CONSTRAINTS."]}
          intro="Industrial projects require engineering decisions to respond to site conditions, equipment integration and execution constraints. Project-specific constraints remain unpublished until verified."
          items={jagdambaProjectChallenges}
        />
        <ProjectEngineeringApproach sectionNumber="05" heading={["FROM PLAN", "TO EXECUTION."]} intro="A general execution framework from equipment planning and design through fabrication and coordinated installation." stages={engineeringExecutionStages} />
        <ProjectPlantSystem
          sectionNumber="06"
          heading={isPlant ? ["ONE PROCESS.", "CONNECTED", "EQUIPMENT."] : ["ONE MACHINE.", "PART OF A", "CONNECTED SYSTEM."]}
          intro={isPlant ? "Published project scope shown as one coordinated plant sequence." : "This equipment record is presented within the wider context of an integrated industrial process."}
          system={plantSystemForRecord(record, source)}
        />
        <ProjectExecutionJourney sectionNumber="07" heading={["FROM", "FABRICATION", "TO THE FIELD."]} intro={`A field record using verified media associated with ${record.name}.`} stages={stages} />
        <ProjectFinalResult
          sectionNumber="08"
          heading={["PROJECT.", "FIELD.", "RECORD."]}
          client={client}
          capacity={capacity}
          projectType={projectType}
          location={location}
          statement={summary}
          mediaSrc={completedMedia.src}
          poster={poster}
          mediaType={completedMedia.type}
          mediaAlt={`${record.name} ${completedMedia.label.toLowerCase()}`}
          recordNumber={recordNumber}
          captionLabel={record.name.toUpperCase()}
        />
        <ProjectEngineeringNotes sectionNumber="09" heading={["ENGINEERING", "TAKEAWAYS."]} intro="General observations from S.K. Engineering Works' approach to connected machinery and project execution." notes={engineeringNotes} />
        <TrustedClientsSection standalone sectionNumber="10" />
        <ProjectEnquirySection sectionNumber="11" showNavigation />
      </main>
    </>
  );
}
