// src/utils/mindmapUtils.js

export const convertToFlowElements = (content) => {
  const nodes = [];
  const edges = [];

  // Root node (lessonTitle)
  nodes.push({
    id: 'root',
    data: { label: content.lessonTitle },
    position: { x: 400, y: 50 },
    style: { background: '#D6EAF8', padding: 10, borderRadius: 5 },
  });

  let yOffset = 150; // initial y position for first section

  content.sections.forEach((section, i) => {
    const sectionId = `section-${i}`;
    nodes.push({
      id: sectionId,
      data: { label: section.text || section.type },
      position: { x: 200 + (i % 3) * 200, y: yOffset },
      style: { background: '#AED6F1', padding: 8, borderRadius: 5 },
    });

    edges.push({ id: `edge-root-${i}`, source: 'root', target: sectionId });

    // Add list items if present
    if (section.items) {
      section.items.forEach((item, j) => {
        const itemId = `${sectionId}-item-${j}`;
        nodes.push({
          id: itemId,
          data: { label: item },
          position: { x: 150 + (j % 4) * 150, y: yOffset + 100 + Math.floor(j / 4) * 50 },
          style: { background: '#D4E6F1', padding: 6, borderRadius: 4 },
        });
        edges.push({ id: `edge-${sectionId}-${j}`, source: sectionId, target: itemId });
      });
    }

    yOffset += 250; // move down for next section
  });

  return { nodes, edges };
};
