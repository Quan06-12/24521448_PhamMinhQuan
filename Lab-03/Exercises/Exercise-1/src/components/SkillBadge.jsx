/**
 * One skill item. Renders an <li>, so it must be placed inside a <ul>/<ol>.
 * @param {{ name: string, tier?: 'Core' | 'Awareness' | 'Later', className?: string }} props
 */
export function SkillBadge({ name, tier = 'Core', className = '' }) {
  return (
    <li className={className}>
      {name} <small>({tier})</small>
    </li>
  );
}