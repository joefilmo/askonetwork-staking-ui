import theme from "@chakra-ui/theme"

theme.colors = {
  //asko: {
  //  bg: "#1A202C",
  //  bgMed: "#252D3B",
  //  bgMed2: "#2E3A5A",
  //  accentButton: "#00C6AA",
  //  fg: "#F5F5F5",
  //  fgMed: "#8E98A2",
  //  fgMed2: "#879AB7",
  //  fgAccent: "#00C6AA",
  //  stroke: "#879AB7",
  //  strokeAccent: "#09FFDC"
  //},
  asko: {
    bg: "#1A202C",
    bgMed: "#252D3B",
    bgMed2: "#2E3A5A",
    accentButton: "#0D51A0",
    fg: "#F5F5F5",
    fgMed: "#8E98A2",
    fgMed2: "#879AB7",
    fgAccent: "#2DB3E7",

    stroke: "#879AB7",
    strokeAccent: "#34BDEE"
  },
  ...theme.colors
}

console.log("theme breakpoitns",theme.breakpoints)
theme.breakpoints = {
  sm:"650px",
  md:"900px",
  lg:"1240px",
  xl:"1920px"
}
console.log("theme breakpoitns",theme.breakpoints)
export default theme
