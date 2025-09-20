export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  errors?: Record<string, unknown>;
}

export function createProblemDetails(init: ProblemDetails): ProblemDetails {
  return {
    type: init.type,
    title: init.title,
    status: init.status,
    detail: init.detail,
    instance: init.instance,
    errors: init.errors,
  };
}
