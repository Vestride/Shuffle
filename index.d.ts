// Type definitions for Shuffle 5.0
// Project: https://github.com/Vestride/Shuffle
// Definitions by: Glen Cheney <https://github.com/Vestride>

export as namespace Shuffle;
export = Shuffle;

interface FilterMode {
  ALL: string;
  ANY: string;
}

declare class ShuffleItem {
  constructor(element: Element);
  addClasses(classes: string[]): void;
  applyCss(obj: object): void;
  dispose(): void;
  hide(): void;
  init(): void;
  removeClasses(classes: string[]): void;
  show(): void;
  id: number;
  element: Element;
  isVisible: boolean;
}

declare namespace ShuffleItem {
  const Css: {
    HIDDEN: {
      after: object;
      before: object;
    };
    INITIAL: object;
    VISIBLE: {
      after: object;
      before: object;
    };
  };
  const Scale: {
    HIDDEN: number;
    VISIBLE: number;
  };
}

declare class Shuffle {
  constructor(element: Element, options?: Shuffle.ShuffleOptions);

  /**
   * New items have been appended to shuffle. Mix them in with the current filter or sort status.
   * @param {Element[]} newItems Collection of new items.
   */
  add(newItems: Element[]): void;

  /**
   * Destroys shuffle, removes events, styles, and classes
   */
  destroy(): void;

  /**
   * Disables shuffle from updating dimensions and layout on resize
   */
  disable(): void;

  /**
   * Enables shuffle again.
   * @param {boolean} [isUpdateLayout=true] if undefined, shuffle will update columns and gutters
   */
  enable(isUpdateLayout?: true): void;

  /**
   * Filter items.
   * @param {string|string[]|Function} [category] Category to filter by.
   *     Can be a function, string, or array of strings.
   * @param {Object} [sortObj] A sort object which can sort the visible set
   */
  filter(category?: string|string[]|Function, sortObj?: object): void;

  /**
   * Retrieve a shuffle item by its element.
   * @param {Element} element Element to look for.
   */
  getItemByElement(element: Element): ShuffleItem|null;

  /**
   * Use this instead of `update()` if you don't need the columns and gutters updated
   * Maybe an image inside `shuffle` loaded (and now has a height), which means calculations
   * could be off.
   */
  layout(): void;

  /**
   * Remove 1 or more shuffle items.
   * @param {Element[]} elements An array containing one or more
   *     elements in shuffle
   */
  remove(elements: Element[]): Shuffle;

  /**
   * Dump the elements currently stored and reinitialize all child elements which
   * match the `itemSelector`.
   */
  resetItems(): void;

  /**
   * Gets the visible elements, sorts them, and passes them to layout.
   * @param {Object} [sortOptions] The options object to pass to `sorter`.
   */
  sort(sortOptions?: {reverse?: boolean, by?: Function, randomize?: boolean }): void;

  /**
   * Reposition everything.
   * @param {boolean} [isOnlyLayout=false] If true, column and gutter widths won't be recalculated.
   */
  update(isOnlyLayout?: false): void;

  /**
   * Returns styles which will be applied to the an item for a transition.
   * @param {object} obj Transition options.
   */
  protected getStylesForTransition(obj: { item: ShuffleItem, styles: object }): object;

  /**
   * Mutate positions before they're applied.
   * @param {Shuffle.Rect[]} itemRects Item data objects.
   * @param {number} containerWidth Width of the containing element.
   */
  protected getTransformedPositions(itemRects: Shuffle.Rect[], containerWidth: number): Shuffle.Point[];

  /**
   * Sets css transform transition on a group of elements. This is not executed
   * at the same time as `item.init` so that transitions don't occur upon
   * initialization of Shuffle.
   * @param {ShuffleItem[]} items Shuffle items to set transitions on.
   */
  protected setItemTransitions(items: ShuffleItem[]): void;

  /** Width of one column */
  colWidth: number;

  /** Total number of columns */
  cols: number;

  /** Width of `element` */
  containerWidth: number;

  /** Main element */
  element: Element;

  /** Current filter group */
  group: string;

  /** Unique identifier for this instance */
  id: string;

  /** Whether this instance has been destroyed */
  isDestroyed: boolean;

  /** Whether this instance is enabled */
  isEnabled: boolean;

  /** Whether this instance has been initialized */
  isInitialized: boolean;

  /** Whether items are currently transitioning */
  isTransitioning: boolean;

  /** ShuffleItems being kept track of */
  items: ShuffleItem[];
  lastFilter: any;
  lastSort: any;

  /** Current (merged) options */
  options: Shuffle.ShuffleOptions;

  /** Item positions */
  positions: number[];

  /** Number of currently visible items */
  visibleItems: number;
}

declare namespace Shuffle {
  /** Filter string for all items */
  let ALL_ITEMS: 'all';

  /** Data attribute key to use. */
  let FILTER_ATTRIBUTE_KEY: 'groups';

  /** Class name strings */
  const Classes: {
    BASE: string;
    HIDDEN: string;
    SHUFFLE_ITEM: string;
    VISIBLE: string;
  };

  /** Event types emitted by the instance */
  const EventType: {
    LAYOUT: string;
    REMOVED: string;
  };

  /** Available filter modes. */
  const FilterMode: FilterMode;

  /** ShuffleItem class */
  const ShuffleItem: ShuffleItem;

  /**
   * Returns the outer width of an element, optionally including its margins.
   * @param {Element} element The element.
   * @param {boolean} [includeMargins=false] Whether to include margins.
   */
  function getSize(element: Element, includeMargins?: false): {width: number, height: number};

  class Rect {
    constructor(x: number, y: number, w: number, h: number, id?: number);
    id: number;
    left: number;
    top: number;
    width: number;
    height: number;
  }

  namespace Rect {
    function intersects(a: Rect, b: Rect): boolean;
  }

  class Point {
    constructor(x?: number, y?: number);
    x: number;
    y: number;
  }

  namespace Point {
    function equals(a: Point, b: Point): boolean;
  }

  /** Default options that can be overridden. */
  interface ShuffleOptions {

    /**
     * Useful for percentage based heights when they might not always be exactly
     * the same (in pixels).
     */
    buffer?: number;

    /**
     * Reading the width of elements isn't precise enough and can cause columns to
     * jump between values.
     */
    columnThreshold?: number;

    /**
     * A static number or function that returns a number which tells the plugin
     * how wide the columns are (in pixels).
     */
    columnWidth?: number;

    /**
     * If your group is not json, and is comma delimeted, you could set delimiter to ','.
     */
    delimiter?: string;
    delimeter?: string;

    /**
     * CSS easing function to use.
     */
    easing?: string;

    /**
     * Affects using an array with filter. e.g. `filter(['one', 'two'])`. With "any",
     * the element passes the test if any of its groups are in the array. With "all",
     * the element only passes if all groups are in the array.
     */
    filterMode?: FilterMode;

    /**
     * Initial filter group.
     */
    group?: string;

    /**
     * A static number or function that tells the plugin how wide the gutters
     * between columns are (in pixels).
     */
    gutterWidth?: number;

    /**
     * Shuffle can be isInitialized with a sort object. It is the same object
     * given to the sort method.
     */
    initialSort?: object;

    /**
     * Whether to center grid items in the row with the leftover space.
     */
    isCentered?: boolean;

    /**
     * e.g. '.picture-item'.
     */
    itemSelector?: string;

    /**
     * Whether to round pixel values used in translate(x, y). This usually avoids blurriness.
     */
    roundTransforms?: boolean,

    /**
     * Element or selector string. Use an element to determine the size of columns and gutters.
     */
    sizer?: Element|string;

    /**
     * Transition/animation speed (milliseconds).
     */
    speed?: number;

    /**
     * Transition delay offset for each item in milliseconds.
     */
    staggerAmount?: number;

    /**
     * Maximum stagger delay in milliseconds.
     */
    staggerAmountMax?: number;

    /**
     * How often shuffle can be called on resize (in milliseconds).
     */
    throttleTime?: number;

    /**
     * Whether to use transforms or absolute positioning.
     */
    useTransforms?: boolean;

    /**
     * By default, shuffle will throttle resize events. This can be changed or removed.
     */
    throttle?(func: Function, wait: number): Function;
  }
}
