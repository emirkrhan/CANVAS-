
export type Step = 'start' | 'upload' | 'analysis' | 'layout' | 'workspace';

export interface LayoutOption {
  id: string;
  name: string;
  description: string;
  ratio: string;
  image: string;
  prompt?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface AppConfig {
  layoutId?: string;
  brandColors?: boolean;
  iconStyle?: string;
  density?: number;
}

export enum AspectRatio {
  Square = "1:1",
  Portrait34 = "3:4",
  Landscape43 = "4:3",
  Portrait916 = "9:16",
  Landscape169 = "16:9",
}

export interface Section {
  id: string;
  title: string;
  content: string;
  icon?: string;
  stats?: string;
  details?: string;
  chartData?: { label: string; value: number }[];
  statistics?: string;
  imageScale?: number;
}

export type SectionLayout = 'top' | 'bottom' | 'left' | 'right';

export type WorkspaceSection = Section & { 
    rect: { x: number; y: number; w: number; h: number };
    zIndex?: number;
    textScale?: number;
    layout?: SectionLayout;
};

export interface SavedProject {
  id: string;
  title: string;
  citation: string;
  layoutId: string;
  sections: WorkspaceSection[];
  headerColor: string;
  lastModified: number;
}

export interface ExtractedData {
  url: string;
  journal: {
    key: string;
    name: string;
  };
  metadata: {
    title: string;
    articleType: string;
    doi: string;
    journal: string;
    authors: string[];
    publishDate: string;
  };
  sections: {
    title: string;
    description: string;
    recommendedIcons: {
      name: string;
      category: string;
      url: string;
      license: string;
      author: string;
    }[];
  }[];
}
