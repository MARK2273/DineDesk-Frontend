// Allow importing CSS files in TypeScript
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

// Allow importing SCSS files (optional)
declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}
