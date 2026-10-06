import { Task, RecommendationResult } from '../types';

export function calculateTaskRecommendations(
  tasks: Task[],
  availableMinutes: number
): RecommendationResult[] {
  // Only evaluate active tasks that are NOT completed today
  const eligibleTasks = tasks.filter(t => t.status === 'active');

  if (eligibleTasks.length === 0) {
    return [];
  }

  const scoredResults: RecommendationResult[] = eligibleTasks.map(task => {
    let score = 0;
    const est = task.estimatedMinutes;

    // 1. Priority Score
    let priorityScore = 0;
    if (task.priority === 'high') priorityScore = 55;
    else if (task.priority === 'medium') priorityScore = 32;
    else priorityScore = 15;
    score += priorityScore;

    // 2. Time Fit Score
    let timeFitScore = 0;
    let timeFitReason = '';

    if (est <= availableMinutes) {
      // Perfect or comfortable fit
      const ratio = est / availableMinutes;
      if (ratio >= 0.7 && ratio <= 1.0) {
        timeFitScore = 45; // Optimal slot filler
        timeFitReason = `Exact fit for your ${availableMinutes} min slot (${est} min estimated).`;
      } else if (ratio >= 0.4) {
        timeFitScore = 35;
        timeFitReason = `Comfortably fits in ${est} min with extra buffer time.`;
      } else {
        timeFitScore = 25;
        timeFitReason = `Quick ${est} min task for rapid completion.`;
      }
    } else {
      // Task exceeds available time
      const overMinutes = est - availableMinutes;
      if (overMinutes <= 15) {
        timeFitScore = 10; // Can do partial or sprint
        timeFitReason = `Slightly longer (${est} min), but great for an intensive sprint.`;
      } else {
        timeFitScore = -25;
        timeFitReason = `Requires ${est} min, which exceeds your current ${availableMinutes} min slot.`;
      }
    }
    score += timeFitScore;

    // 3. Deadline / Urgency Score
    let urgencyScore = 0;
    let urgencyReason = 'Standard schedule.';
    if (task.deadline) {
      const now = new Date();
      const deadlineDate = new Date(task.deadline);
      const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 3600 * 24));

      if (diffDays <= 0) {
        urgencyScore = 50;
        urgencyReason = '🔴 High Urgency: Due today or overdue!';
      } else if (diffDays <= 2) {
        urgencyScore = 35;
        urgencyReason = `🟠 Approaching deadline: Due in ${diffDays} day(s).`;
      } else if (diffDays <= 7) {
        urgencyScore = 18;
        urgencyReason = `Approaching milestone due this week.`;
      }
    }
    score += urgencyScore;

    // 4. Category Balance / Recency Context
    let workloadScore = 0;
    let workloadReason = 'Core curriculum.';
    if (task.category === 'GATE' || task.category === 'Machine Learning') {
      workloadScore = 15; // Janith's top career goals
      workloadReason = 'Directly builds towards ML Engineer & GATE mastery.';
    } else if (task.category === 'Internship') {
      workloadScore = 12;
      workloadReason = 'High priority internship deliverable.';
    } else if (task.category === 'Aptitude') {
      workloadScore = 8;
      workloadReason = 'Essential daily practice for placement readiness.';
    }
    score += workloadScore;

    // Build human-friendly rationale
    const reasoningParts: string[] = [];
    if (task.priority === 'high') reasoningParts.push('High Priority goal');
    if (est <= availableMinutes) reasoningParts.push(`fits your ${availableMinutes}-minute window (${est}m)`);
    if (task.deadline) reasoningParts.push('has an active deadline');
    reasoningParts.push(workloadReason.toLowerCase());

    const reasoning = `Recommended because it ${reasoningParts.join(', ')}.`;

    return {
      task,
      score,
      reasoning,
      details: {
        timeFit: timeFitReason,
        priorityImpact: `${task.priority.toUpperCase()} priority (+${priorityScore} pts)`,
        urgency: urgencyReason,
        workloadContext: workloadReason,
      },
    };
  });

  // Sort descending by calculated score
  return scoredResults.sort((a, b) => b.score - a.score);
}
