import { LayoutOption } from './types';

const BASE_PROMPT = `Create a minimalist wireframe thumbnail icon for a scientific graphical abstract layout.

Style:
- Simple geometric shapes (rectangles) representing content sections
- White background with light gray (#F3F4F6) section backgrounds
- Navy blue (#1B365D) border for active/selected sections
- Thin gray borders (1px, #E5E7EB) for section dividers
- Small placeholder icons in each section (simple circles/squares)
- Placeholder text lines (3-4 horizontal gray lines per section)

Layout Structure: [SPECIFIC LAYOUT]
- Dimensions: 300px × 200px thumbnail
- Top margin: 8px for title area (navy blue accent bar)
- Padding: 12px inside each section
- Section gaps: 8px between panels

Visual indicators:
- Header area: Small circle (icon placeholder) + 2 text lines
- Content area: 3-4 horizontal lines (text placeholder)
- Use subtle drop shadow for depth: 0 1px 3px rgba(0,0,0,0.1)

Do not include any text labels. Pure wireframe layout structure only.`;

export const LAYOUT_OPTIONS: LayoutOption[] = [
  {
    id: 'clinical-trial',
    name: 'Klinik Deneme',
    description: '4 Panelli Yatay Akış',
    ratio: '4:1 Oran',
    // Hardcoded URL (using available asset) to prevent regeneration
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCs1U5LZXNuYJQvgDABxio2bIZt-pbrev5F4ez7Ls8afQoVXK5-_uQeFPrZA3RZ9Oddj_Vveut5Gpt5z4dKne1jI8LYPnOuwfkqfUxJRce0MJY648lmaiWoocYnY-CewB8jQP8qIEoV7SHq94M4ZiGosfzxfhIdWS7n7-0m0DNRYBmrnDEYVu96ZQpivEYB88X7IMFhVoQneMNIrtaqX4GI7O-fyCkF2Y8uTC3FEq_-_QhWasG7t2Poz9xEc-oZyP91ToTTNRIw838',
    prompt: `${BASE_PROMPT}

Specific Prompts for Each Layout
1. 4-Panel Horizontal (Clinical Trial)
[Base prompt above] + 

Layout Structure: Four equal-width vertical panels side by side
- Panel 1 (left): Icon placeholder circle + 3 text lines
- Panel 2: Icon placeholder circle + 3 text lines  
- Panel 3: Icon placeholder circle + bar chart placeholder (3 vertical bars)
- Panel 4 (right): Icon placeholder circle + 3 text lines

Top accent bar spans all 4 panels. Navy blue highlight on panel 3 to indicate primary outcome emphasis.`
  },
  {
    id: 'meta-analysis',
    name: 'Meta-Analiz',
    description: '3 Sütunlu Dikey Karşılaştırma',
    ratio: '3:1 Oran',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2NMObA2d99VZrGttYAkJm8YLOcBLd7WfaYr11DucRynfrSJaWoFQ28MAVUeZrFWBRc6WQ-g9XcvDWWVKD2adiTrFWG5LmMXyHeyz3dR8ohpfuTfOLxr6SyO9lPcJj0LjCGcJB1SvO9TS-JCDpSQbap2DKZyKOx_mhKl51AJncptEMvP6wqerfSzbRCcmLXqSXZwffLUCuR3MTXldfCUmbdien5Is6mUhCxTF0rH_NUOyqrstbQrT6xY8igYM0va9X6YF5xi2BPH4',
    prompt: `${BASE_PROMPT}

Specific Prompts for Each Layout
2. 3-Column Vertical (Meta-Analysis)
[Base prompt above] +

Layout Structure: Three equal-width columns with header row
- Top row (full width): Navy bar + 2 text lines
- Column 1: Funnel icon (triangle) + 3 text lines
- Column 2: Forest plot placeholder (horizontal lines with center diamond) + 3 text lines
- Column 3: Table placeholder (grid of small rectangles) + 2 text lines

Subtle vertical dividers between columns. Navy highlight on column 2 (results emphasis).`
  },
  {
    id: 'longitudinal-study',
    name: 'Boylamsal Çalışma',
    description: 'Zaman Çizelgesi Akışı',
    ratio: 'Manzara',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3mjMh5CNM0DWwihMHE44HkhWjDBIuGJYbVvhgW1tkiouxdjNta9L6m7f6xr-VWI6j04dOAbBtIOJwLdXx_KH3mYh1QLI9Y1h-GqzRk8mLqotmGTpQSO2XF0rSfN5K-BoKt4hNMuh64d1m_h52aGHXaZHRl_x2OqLbHK3E_poEy27gfACRbKCr8yUIQHUOuoaOE2lft5AGkI0QmcOmiL06sIBSfafov3HH_HwyKJe82W1G1jJ9e_RWUqwCwF_ou46H8D0diYagqjk',
    prompt: `${BASE_PROMPT}

Specific Prompts for Each Layout
3. Timeline Flow (Longitudinal Study)
[Base prompt above] +

Layout Structure: Horizontal timeline with 4 connected nodes
- Left to right arrow flow
- Node 1: Circle (Baseline) + 2 text lines
- Node 2: Circle (Intervention) + 2 text lines  
- Node 3: Circle (Follow-up) + 2 text lines
- Node 4: Circle (Outcome) + bar chart
- Connecting arrows between nodes (navy blue, 2px thick)

Top accent bar. Timeline spans 80% of width. Navy highlight on final node.`
  },
  {
    id: 'comparative-study',
    name: 'Karşılaştırmalı Çalışma',
    description: '2x2 Izgara Matrisi',
    ratio: '1:1 Izgara',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBr0N24a1KUiSHeNcepp4Akg5ObYEbVAvNKWxIvM3TKl4AuwDRAJJbeNb2UnN62Q8z7HrsW-qN9c99E47Tt3Vlg9_RX2tQj1sAuls2_qE05K-QRm51CnGWZ1rdB4ke4XTDbcJ9LpIt0oBKKKeTr2tpq5Bu_qLalZc1wNMVvhUCu5_Hy6LXbmDrF15wYLu5uTPfHtw7-vf2HoryP-fRjr8mSf6olQSNt6eakbCVz0fWaBiq4lqxZTC7jSpJO85w_awCvDZeAejDbbJ4',
    prompt: `${BASE_PROMPT}

Specific Prompts for Each Layout
4. 2×2 Grid (Comparative Study)
[Base prompt above] +

Layout Structure: 2 rows × 2 columns grid layout
- Top-left: Icon circle + "Group A" placeholder text + 2 lines
- Top-right: Icon circle + "Group B" placeholder text + 2 lines
- Bottom-left: Small bar chart (3 bars) + 2 text lines
- Bottom-right: Small bar chart (3 bars) + 2 text lines

Central cross divider (thicker, navy blue). Navy accent bar at top. Equal-sized quadrants.`
  },
  {
    id: 'cycle-process',
    name: 'Döngü / Süreç',
    description: 'Dairesel Akış',
    ratio: 'Esnek',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC92txxZA3Z5XnZ78A_ms-oLiIdCAu2bbCy4jjoHVax7XTFnNlz1h7cIYtNnnSXfdEE3OmxGbuw8cM4aOAbf4InvQcOh-JuAZHdDdi-VvCv-EtU5uAYJF_J_-it3Tgf_QEAQzvrPeeb4GgWbTtZQGFiuVU4GaER-j4-qhwbKNgyjWJ5lJiLqVd4-dF-8KazJQVeRSgguZesaVVjTuMWnzyRVTSSYeuRM505Ncp-rglXT8FOvq4NeyfAC3cxdWzUoVZqI4YN2ghjLZE',
    prompt: `${BASE_PROMPT}`
  },
  {
    id: 'blank-canvas',
    name: 'Boş Tuval',
    description: 'Sıfırdan başla',
    ratio: 'Esnek',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC92txxZA3Z5XnZ78A_ms-oLiIdCAu2bbCy4jjoHVax7XTFnNlz1h7cIYtNnnSXfdEE3OmxGbuw8cM4aOAbf4InvQcOh-JuAZHdDdi-VvCv-EtU5uAYJF_J_-it3Tgf_QEAQzvrPeeb4GgWbTtZQGFiuVU4GaER-j4-qhwbKNgyjWJ5lJiLqVd4-dF-8KazJQVeRSgguZesaVVjTuMWnzyRVTSSYeuRM505Ncp-rglXT8FOvq4NeyfAC3cxdWzUoVZqI4YN2ghjLZE',
    prompt: `${BASE_PROMPT}

Specific Prompts for Each Layout
5. Blank Canvas
[Base prompt above] +

Layout Structure: Empty canvas with grid guidelines
- Dotted grid pattern (20px spacing, light gray #E5E7EB)
- Large centered placeholder icon: Plus sign in circle (navy blue outline)
- Single text line below: "Start from scratch"
- No sections or content areas
- Subtle border around entire canvas

Top accent bar in navy blue. Minimalist, inviting empty state.`
  }
];

export const TEMPLATE_IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAWXjRh-zrw478lK5R-DgKIbOlsjxotLypFuBGZawVrXeI6BhnMOcl2ZzkJmSJf4ahVeODIYX3uO5SLQFwvk_loIKS5bEccKpFZ1kWWDEeTY01kh0_D6lR1Y356Du2MeQHPgawelAl1HPLyDxu93JAbJfVoUcF0J-xnyD9KwmtomKVsG1mXvrTbZmxtdAktS4jCFIbjxZtvvPKByxXWo89577rcSEozjdE0H_YPKjIaOdFws623hqjVP-jFvbtKUMdgA878G55ffdA",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAeTil2LzMcNXXZCCgG0AA2avHWfKVOryrwzhwpK8maCdHLYVkCg2IKgKbJGaQJbR-uLERNCCOGIwgSHQ9gkKj9afQjjtx-n6k4dCKChaNFY0DyMKeF93mH8TcngdijIGAXtWGM9YjbbyMfphirKNP_6XuCoDJDsGEJVmsUh4Cy-uSZrcLVWXuJse-L7lSPTAnGAb5u0svbn_sD_J0QLJsFF07pu89YgCSSZYouWm7jmo-fupOznxK77L78DuqyoqVKNhpWc6--KXg",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB8fLpx_K2HtM3CJvx1mQmKLBxnEs9eMn5XxndkDe_E8HZ2G0x7PKX-BDIqDdft3r3u_CH2gPYez8SHgxdfSF3yi3w8o5EIzNlds9rgfMDNpLIJmdf7kRHUPR_kl3fJHKf54evBiiwFpsj_qsq-kkCgN206fg_Xbt4YY7wBruDIJQ-g21AGrqr95M3q60EihelCT1bHT49mZMPgdlOGM61SjsVEIuSv-3zisNKy60cZhmbvexARcUnLB2WALXWyRS-UU9i72IYNpDE",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCWz4PnQ5NU4oc0ZoeMg50vd3s4IQuRuyHeHz14cFw4crY_hJ6zV31nayoQjvhRSiRIKyEkyLmwagcl4YRzPs6kDTbWxOCnAOEzT_RUtHE5G39clgN8zZlosMgbkpeJhuFGq3qlBvpMPsZroyKSPyYjMSGnwF2MzStutCrybbLgL0QEquVw82oTf6wz-8fyCzHPkfZa3qRK6GWtdpolZxc8qLw25-tJ1c9DXdN_-I3MknOYtPo2ynC-Sl-fChMZtvlEjoFKPNkGI-w"
];