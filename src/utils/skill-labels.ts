import skillLabelsMap from '../data/skill-labels.json';

/**
 * Get the human-readable label for a machine label (skill slug)
 * Falls back to the machine label if no mapping exists
 * @param machineLabel - The machine label (e.g., 'react', 'next-js')
 * @returns The human label (e.g., 'React.js', 'Next.js') or the machine label if not found
 */
export function getSkillLabel(machineLabel: string): string {
  return skillLabelsMap[machineLabel as keyof typeof skillLabelsMap] || machineLabel;
}

/**
 * Transform an array of machine labels to human labels
 * @param machineLabels - Array of machine labels
 * @returns Array of human-readable labels
 */
export function getSkillLabels(machineLabels: string[]): string[] {
  return machineLabels.map(getSkillLabel);
}

/**
 * Get all available skill mappings
 * @returns The complete mapping object
 */
export function getAllSkillLabels(): Record<string, string> {
  return skillLabelsMap;
}
