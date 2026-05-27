export interface OnboardingState {
  hasProject: boolean;
  hasReview: boolean;
  firstProjectId?: string;
}

export type StepState = "complete" | "active" | "locked";

export interface OnboardingStep {
  id: "create-project" | "configure-project" | "share-url";
  title: string;
  description: string;
  state: StepState;
  cta?: {
    label: string;
    triggersCreateProject?: boolean;
    href?: string;
  };
}

export function getOnboardingSteps(state: OnboardingState): OnboardingStep[] {
  const { hasProject, hasReview, firstProjectId } = state;
  const configureState: StepState = hasReview ? "complete" : hasProject ? "active" : "locked";

  return [
    {
      id: "create-project",
      title: "Create your first project",
      description: "Spin up a project to hold the block variants you want to review.",
      state: hasProject ? "complete" : "active",
      cta: hasProject ? undefined : { label: "Create first project", triggersCreateProject: true },
    },
    {
      id: "configure-project",
      title: "Configure your project",
      description: "Install @optio/react, wrap your app, and mark blocks on staging.",
      state: configureState,
      cta:
        configureState === "active" && firstProjectId
          ? { label: "Open project setup", href: `/projects/${firstProjectId}` }
          : undefined,
    },
    {
      id: "share-url",
      title: "Share the staging URL",
      description: "Your client picks variants and leaves comments — feedback lands right here.",
      state: hasReview ? "complete" : "locked",
    },
  ];
}

export interface OnboardingProgress {
  completed: number;
  total: number;
  percent: number;
  done: boolean;
}

export function getOnboardingProgress(steps: OnboardingStep[]): OnboardingProgress {
  const total = steps.length;
  const completed = steps.filter((s) => s.state === "complete").length;
  return {
    completed,
    total,
    percent: Math.round((completed / total) * 100),
    done: completed === total,
  };
}
