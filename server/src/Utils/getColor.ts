const colors: string[] = [
    "coral",
    "mint",
    "yellow",
    "lavender",
    "sky-blue",
    "peach",
    "pink",
    "lilac",
    "ice-blue",
    "lemon",
    "sage",
    "apricot",
    "periwinkle",
    "seafoam",
    "rose",
    "butter"
  ];

export default function getColor(): string{
    let randInd: number = Math.floor(Math.random() * colors.length);
    return colors[randInd];
}