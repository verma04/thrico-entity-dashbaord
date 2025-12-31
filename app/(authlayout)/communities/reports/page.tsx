"use client";
// import React from "react";
// import Reports from "../../../../components/reports/Reports";

// const page = () => {
//   return <Reports />;
// };

// export default page;

// import React, { useState } from "react";
// import { DndContext, closestCenter } from "@dnd-kit/core";
// import {
//   arrayMove,
//   SortableContext,
//   useSortable,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import { List, Card } from "antd";

// const DraggableItem = ({ id, item }) => {
//   const { attributes, listeners, setNodeRef, transform, transition } =
//     useSortable({ id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     cursor: "move",
//     marginBottom: "8px",
//   };

//   return (
//     <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
//       <Card>{item}</Card>
//     </div>
//   );
// };

// const DndAntdList = () => {
//   const [items, setItems] = useState(["Item A", "Item B", "Item C", "Item D"]);

//   const handleDragEnd = (event) => {
//     const { active, over } = event;

//     if (active.id !== over?.id) {
//       const oldIndex = items.indexOf(active.id);
//       const newIndex = items.indexOf(over.id);
//       setItems((items) => arrayMove(items, oldIndex, newIndex));
//     }
//   };

//   return (
//     <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
//       <SortableContext items={items} strategy={verticalListSortingStrategy}>
//         <List
//           dataSource={items}
//           renderItem={(item) => (
//             <List.Item>
//               <DraggableItem id={item} item={item} />
//             </List.Item>
//           )}
//         />
//       </SortableContext>
//     </DndContext>
//   );
// };

// export default DndAntdList;

import React from "react";

const page = () => {
  return <div>page</div>;
};

export default page;
