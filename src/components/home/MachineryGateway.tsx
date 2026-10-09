import Link from "next/link";
import "./machinery-gateway.css";

const categories = [
  "MATERIAL HANDLING",
  "MILLING & SIZE REDUCTION",
  "AIR & DUST HANDLING",
  "SCREENING & SEPARATION",
  "STORAGE & PROCESS EQUIPMENT",
];

export default function MachineryGateway() {
  return (
    <section className="machinery-gateway" aria-labelledby="machinery-gateway-heading">
      <div className="machinery-gateway-shell">
        <p className="machinery-gateway-eyebrow">MACHINERY / SYSTEMS</p>
        <div className="machinery-gateway-layout">
          <h2 id="machinery-gateway-heading">BUILT FOR<br /><span>INDUSTRIAL PROCESSING.</span></h2>
          <div className="machinery-gateway-index">
            <ol aria-label="Machinery categories">
              {categories.map((category, index) => (
                <li key={category}><span>{String(index + 1).padStart(2, "0")}</span><strong>{category}</strong></li>
              ))}
            </ol>
            <Link href="/machinery">VIEW ALL MACHINERY <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
