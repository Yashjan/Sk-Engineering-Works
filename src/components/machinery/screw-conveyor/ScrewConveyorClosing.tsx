/** @jsxImportSource @/i18n/react */
import { MachineryProcessIntegration, MachineryEngineering } from "../detail/MachineryPlantSections";
import type { MachineryConfig } from "@/data/machinery-details";
import TrustedClientsSection from "@/components/home/TrustedClientsSection";
import MachineryEnquiry from "../detail/MachineryEnquiry";
import SiteFooter from "@/components/layout/SiteFooter";
import ScrewConveyorFabricationGallery from "./ScrewConveyorFabricationGallery";
import "./screw-conveyor-closing.css";

export default function ScrewConveyorClosing({ config }: { config: MachineryConfig }) {
  return <>
    <ScrewConveyorFabricationGallery />

    <MachineryProcessIntegration config={config} />
    <MachineryEngineering config={config} />

    <TrustedClientsSection standalone sectionNumber="12" />
    <MachineryEnquiry {...config.enquiry} />
    <div className="machine-enquiry-footer"><SiteFooter /></div>
  </>;
}
