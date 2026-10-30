import { TECH_STACK } from "../data/TechStack.js";

export default function TechBadge({ tech }) {
  const config = TECH_STACK[tech];
  if (!config) return null; 
  return (
    <span className="tech-badge" style={{ "--tech-color": config.color }} title={config.name}>
      <i className={config.icon}></i>
      <span className="tech-name">{config.name}</span>
    </span>
  );
}