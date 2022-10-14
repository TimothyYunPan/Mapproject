// import { useRef, useState } from "react";
// import { useScroll } from "@react-hooks-library/core";

// export function ScrollDetect() {
//   const box = useRef<HTMLDivElement | null>(null);
//   const [scroll, setScroll] = useState({ x: 0, y: 0 });
//   console.log(scroll);

//   useScroll(box, ({ scrollX, scrollY }) => setScroll({ x: scrollX, y: scrollY }));

//   return (
//     <div ref={box}>
//       <div>Scroll Vertically and Horizontally</div>
//     </div>
//   );
// }
