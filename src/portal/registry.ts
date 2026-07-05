import { maffetoneApp } from "../apps/maffetone";

export interface PortalApp {
  slug: string;
  name: string;
  description: string;
  render: (req: Request) => Response | Promise<Response>;
}

export const apps: PortalApp[] = [maffetoneApp];

export function getApp(slug: string): PortalApp | undefined {
  return apps.find((app) => app.slug === slug);
}
