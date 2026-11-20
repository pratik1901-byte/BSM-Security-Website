/**
 * Shapes every media entry is declared with.
 *
 * Nothing in here points at a file: the dictionaries do that, so a type change
 * and a content change never land in the same place.
 */

export type Shot = {
  src: string;
  /** Describes what is actually visible, for screen readers. */
  alt: string;
  /** Caption shown under the frame. */
  label: string;
  /** What BSM's replacement photograph should show. */
  brief: string;
  /** Native aspect ratio, so the whole photograph is shown uncropped. */
  ratio?: string;
  /** CSS object-position used when the photograph is cropped to fill. */
  focus?: string;
};

/** One frame on the gallery page. */
export type GalleryItem = {
  /** An existing shot, or omitted to render the placeholder frame. */
  shot?: Shot;
  /** Group the frame is filed under on the gallery page. */
  group: string;
  figure: string;
  /** Used when there is no shot yet. */
  label?: string;
  brief?: string;
  /**
   * The photograph's own width / height. The gallery frames each picture at
   * its true proportions rather than cropping it to a common shape, so this
   * is set for every entry that has a shot.
   */
  ratio?: string;
};
