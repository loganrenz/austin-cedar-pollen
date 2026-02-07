/**
 * Ambient type declarations for Apple MapKit JS (5.x)
 *
 * Minimal declarations covering the most common APIs.
 * Expand as needed when more MapKit features are adopted.
 *
 * @see https://developer.apple.com/documentation/mapkitjs
 */

declare namespace mapkit {
  /** Initialise MapKit JS with a JWT or callback-based authorization. */
  function init(options: {
    authorizationCallback?: (done: (token: string) => void) => void
    language?: string
  }): void

  function addEventListener(type: string, handler: (event: any) => void): void
  function removeEventListener(type: string, handler: (event: any) => void): void

  const loadedLibraries: string[] | undefined
  const version: string | undefined
  const build: string | undefined

  class Coordinate {
    constructor(latitude: number, longitude: number)
    readonly latitude: number
    readonly longitude: number
  }

  class CoordinateSpan {
    constructor(latitudeDelta: number, longitudeDelta: number)
  }

  class CoordinateRegion {
    constructor(center: Coordinate, span: CoordinateSpan)
  }

  class Padding {
    constructor(top: number, right: number, bottom: number, left: number)
  }

  const FeatureVisibility: {
    Hidden: string
    Visible: string
    Adaptive: string
  }

  class Map {
    constructor(element: HTMLElement | string, options?: MapConstructorOptions)
    region: CoordinateRegion
    center: Coordinate
    mapType: string
    addAnnotation(annotation: Annotation): void
    addAnnotations(annotations: Annotation[]): void
    removeAnnotation(annotation: Annotation): void
    removeAnnotations(annotations: Annotation[]): void
    showItems(items: Annotation[], options?: ShowItemsOptions): void
    addEventListener(type: string, handler: (event: any) => void): void
    removeEventListener(type: string, handler: (event: any) => void): void
    destroy(): void

    static readonly MapTypes: {
      Standard: string
      MutedStandard: string
      Satellite: string
      Hybrid: string
    }
  }

  interface MapConstructorOptions {
    showsCompass?: string
    showsZoomControl?: boolean
    showsMapTypeControl?: boolean
    isRotationEnabled?: boolean
    region?: CoordinateRegion
    mapType?: string
  }

  interface ShowItemsOptions {
    animate?: boolean
    padding?: Padding
  }

  class Annotation {
    constructor(coordinate: Coordinate, factory: (coordinate: Coordinate, options: any) => HTMLElement, options?: AnnotationOptions)
    coordinate: Coordinate
    data: any
    title: string
    subtitle: string
  }

  interface AnnotationOptions {
    title?: string
    subtitle?: string
    data?: any
  }

  class ImageAnnotation extends Annotation {
    constructor(coordinate: Coordinate, options?: ImageAnnotationOptions)
  }

  interface ImageAnnotationOptions extends AnnotationOptions {
    url?: { 1: string; 2?: string; 3?: string } | string
  }
}

/** Extend Window to include the MapKit global. */
interface Window {
  mapkit: typeof mapkit
}
