export default function MachineryImagePlaceholder({ machineName }: { machineName: string }) {
  return <div className="machine-image-placeholder" role="img" aria-label={`${machineName} machine image coming soon`}>
    <span>MACHINE VISUAL</span><strong>COMING SOON</strong>
  </div>;
}
