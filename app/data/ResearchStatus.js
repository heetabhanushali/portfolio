export const STATUS = {
  "in-progress":  { label: "In Progress",  icon: "fas fa-spinner",        color: "#5178BD" },
  "under-review": { label: "Under Review", icon: "fas fa-clock",          color: "#FBBF24" },
  "accepted":     { label: "Accepted",     icon: "fas fa-check-circle",   color: "#4ADE80" },
  "presented":    { label: "Presented",    icon: "fas fa-microphone-alt", color: "#A855F7" },
  "publishing":   { label: "Publishing",   icon: "fas fa-file-signature", color: "#F97316" },
  "published":    { label: "Published",    icon: "fas fa-book",           color: "#16A34A" },
};

// order of the lifecycle bar (same order as the keys above)
export const STAGES = Object.keys(STATUS);

// card order on the page: published first
export const SORT_ORDER = {
  published: 0, presented: 1, publishing: 2,
  accepted: 3, "under-review": 4, "in-progress": 5,
};

export const CITABLE = ["accepted", "presented", "publishing", "published"];