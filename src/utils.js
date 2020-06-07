//calculate scale and viewport center world coordinates from bbox
//return {scale, target}
//min, max bbox corners, width height of viewport
export default ({ min, max, width, height }) => {
  const scaleX = width / (max[0] - min[0]);
  const scaleY = height / (max[1] - min[1]);
  const scale = Math.min(scaleX, scaleY);
  const zoom = Math.floor(Math.log2(scale));

  const target = [
    min[0] + 0.5 * (max[0] - min[0]),
    min[1] + 0.5 * (max[1] - min[1]),
    0
  ];

  return { scale, zoom, target };
};
