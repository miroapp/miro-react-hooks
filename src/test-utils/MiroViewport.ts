import { BoardViewport, Item, Offset, OneOrMany, Rect } from "@mirohq/websdk-types";

const hasGeometry = (item: any): item is Rect => {
  return (
    typeof item === "object" && "width" in item && "height" in item && "x" in item && "y" in item
  );
};

function getBoundingRectangle(items: Item[]): Rect {
  if (items.length === 0) {
    // If the array is empty, return a default rectangle
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  const widgets = items.filter((item) => hasGeometry(item)) as Rect[];

  let minX = widgets[0].x || 0;
  let minY = widgets[0].y || 0;
  let maxX = (widgets[0].x || 0) + (widgets[0].width || 0);
  let maxY = (widgets[0].y || 0) + (widgets[0].height || 0);

  for (let i = 1; i < widgets.length; i++) {
    const obj = widgets[i];

    if (obj.x !== undefined) {
      minX = Math.min(minX, obj.x);
      maxX = Math.max(maxX, obj.x + (obj.width || 0));
    }

    if (obj.y !== undefined) {
      minY = Math.min(minY, obj.y);
      maxY = Math.max(maxY, obj.y + (obj.height || 0));
    }
  }

  const width = maxX - minX;
  const height = maxY - minY;

  return { x: minX, y: minY, width, height };
}

export class MiroViewport implements BoardViewport {
  private data: Rect = {
    y: 10,
    x: 20,
    width: 8000,
    height: 6000,
  };

  private zoomLevel: number = 1;

  async get(): Promise<Rect> {
    return this.data;
  }

  async set(options: {
    viewport: Rect;
    padding?: Offset | undefined;
    animationDurationInMs?: number | undefined;
  }): Promise<Rect> {
    this.data = options.viewport;
    return this.data;
  }

  async zoomTo(items: OneOrMany<Item>): Promise<void> {
    const boardItems = Array.isArray(items) ? items : [items];
    const rectangle = getBoundingRectangle(boardItems);
    this.data = rectangle;
  }

  async getZoom(): Promise<number> {
    return this.zoomLevel;
  }

  async setZoom(zoomLevel: number): Promise<void> {
    this.zoomLevel = zoomLevel;
  }
}
