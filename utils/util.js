'use strict'
/**
 * @class KTUtil  base utilize class that privides helper functions
 */

// Polyfills
/**
 * Element.matches() polyfill (simple version)
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
 */
if (process.client) {
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.msMatchesSelector ||
      Element.prototype.webkitMatchesSelector
  }

  /**
   * Element.closest() polyfill
   * https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
   */
  if (!Element.prototype.closest) {
    if (!Element.prototype.matches) {
      Element.prototype.matches =
        Element.prototype.msMatchesSelector ||
        Element.prototype.webkitMatchesSelector
    }
    Element.prototype.closest = function(s) {
      const el = this
      let ancestor = this
      if (!document.documentElement.contains(el)) return null
      do {
        if (ancestor.matches(s)) return ancestor
        ancestor = ancestor.parentElement
      } while (ancestor !== null)
      return null
    }
  }

  /**
   * ChildNode.remove() polyfill
   * https://gomakethings.com/removing-an-element-from-the-dom-the-es6-way/
   * @author Chris Ferdinandi
   * @license MIT
   */
  ;(function(elem) {
    for (let i = 0; i < elem.length; i++) {
      if (!window[elem[i]] || 'remove' in window[elem[i]].prototype) continue
      window[elem[i]].prototype.remove = function() {
        this.parentNode.removeChild(this)
      }
    }
  })(['Element', 'CharacterData', 'DocumentType'])

  //
  // requestAnimationFrame polyfill by Erik Möller.
  //  With fixes from Paul Irish and Tino Zijdel
  //
  //  http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  //  http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
  //
  //  MIT license
  //
  ;(function() {
    let lastTime = 0
    const vendors = ['webkit', 'moz']
    for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame =
        window[vendors[x] + 'RequestAnimationFrame']
      window.cancelAnimationFrame =
        window[vendors[x] + 'CancelAnimationFrame'] ||
        window[vendors[x] + 'CancelRequestAnimationFrame']
    }

    if (!window.requestAnimationFrame)
      window.requestAnimationFrame = function(callback) {
        const currTime = new Date().getTime()
        const timeToCall = Math.max(0, 16 - (currTime - lastTime))
        const id = window.setTimeout(function() {
          // eslint-disable-next-line standard/no-callback-literal
          callback(currTime + timeToCall)
        }, timeToCall)
        lastTime = currTime + timeToCall
        return id
      }

    if (!window.cancelAnimationFrame)
      window.cancelAnimationFrame = function(id) {
        clearTimeout(id)
      }
  })()

  // Source: https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/prepend()/prepend().md
  ;(function(arr) {
    arr.forEach(function(item) {
      if (item.hasOwnProperty('prepend')) {
        return
      }
      Object.defineProperty(item, 'prepend', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function prepend() {
          const argArr = Array.prototype.slice.call(arguments)
          const docFrag = document.createDocumentFragment()

          argArr.forEach(function(argItem) {
            const isNode = argItem instanceof Node
            docFrag.appendChild(
              isNode ? argItem : document.createTextNode(String(argItem))
            )
          })

          this.insertBefore(docFrag, this.firstChild)
        }
      })
    })
  })([Element.prototype, Document.prototype, DocumentFragment.prototype])

  // Global variables
  window.KTUtilElementDataStore = {}
  window.KTUtilElementDataStoreID = 0
  window.KTUtilDelegatedEventHandlers = {}
}
const KTUtil = (function() {
  const resizeHandlers = []

  /** @type {object} breakpoints The device width breakpoints **/
  let breakpoints = {
    sm: 544, // Small screen / phone
    md: 768, // Medium screen / tablet
    lg: 1024, // Large screen / desktop
    xl: 1200 // Extra large screen / wide desktop
  }

  /**
   * Handle window resize event with some
   * delay to attach event handlers upon resize complete
   */
  const _windowResizeHandler = function() {
    const _runResizeHandlers = function() {
      // reinitialize other subscribed elements
      for (let i = 0; i < resizeHandlers.length; i++) {
        const each = resizeHandlers[i]
        each.call()
      }
    }

    let timeout = false // holder for timeout id
    const delay = 250 // delay after event is "complete" to run callback

    window.addEventListener('resize', function() {
      clearTimeout(timeout)
      timeout = setTimeout(function() {
        _runResizeHandlers()
      }, delay) // wait 50ms until window resize finishes.
    })
  }

  return {
    /**
     * Class main initializer.
     * @param {object} options.
     * @returns null
     */
    // main function to initiate the theme
    init(options) {
      if (options && options.breakpoints) {
        breakpoints = options.breakpoints
      }

      _windowResizeHandler()
    },

    /**
     * Adds window resize event handler.
     * @param {function} callback function.
     */
    addResizeHandler(callback) {
      resizeHandlers.push(callback)
    },

    /**
     * Removes window resize event handler.
     * @param {function} callback function.
     */
    removeResizeHandler(callback) {
      for (let i = 0; i < resizeHandlers.length; i++) {
        if (callback === resizeHandlers[i]) {
          delete resizeHandlers[i]
        }
      }
    },

    /**
     * Trigger window resize handlers.
     */
    runResizeHandlers() {
      // eslint-disable-next-line no-undef
      _runResizeHandlers()
    },

    resize() {
      if (typeof Event === 'function') {
        // modern browsers
        window.dispatchEvent(new Event('resize'))
      } else {
        // for IE and other old browsers
        // causes deprecation warning on modern browsers
        const evt = window.document.createEvent('UIEvents')
        evt.initUIEvent('resize', true, false, window, 0)
        window.dispatchEvent(evt)
      }
    },

    /**
     * Get GET parameter value from URL.
     * @param {string} paramName Parameter name.
     * @returns {string}
     */
    getURLParam(paramName) {
      const searchString = window.location.search.substring(1)
      let i
      let val
      const params = searchString.split('&')

      for (i = 0; i < params.length; i++) {
        val = params[i].split('=')
        if (val[0] === paramName) {
          return unescape(val[1])
        }
      }

      return null
    },

    /**
     * Checks whether current device is mobile touch.
     * @returns {boolean}
     */
    isMobileDevice() {
      return this.getViewPort().width < this.getBreakpoint('lg')
    },

    /**
     * Checks whether current device is desktop.
     * @returns {boolean}
     */
    isDesktopDevice() {
      return !KTUtil.isMobileDevice()
    },

    /**
     * Gets browser window viewport size. Ref:
     * http://andylangton.co.uk/articles/javascript/get-viewport-size-javascript/
     * @returns {object}
     */
    getViewPort() {
      let e = window
      let a = 'inner'
      if (!('innerWidth' in window)) {
        a = 'client'
        e = document.documentElement || document.body
      }

      return {
        width: e[a + 'Width'],
        height: e[a + 'Height']
      }
    },

    /**
     * Checks whether given device mode is currently activated.
     * @param {string} mode Responsive mode name(e.g: desktop,
     *     desktop-and-tablet, tablet, tablet-and-mobile, mobile)
     * @returns {boolean}
     */
    isInResponsiveRange(mode) {
      const breakpoint = this.getViewPort().width

      if (mode === 'general') {
        return true
      } else if (
        mode === 'desktop' &&
        breakpoint >= this.getBreakpoint('lg') + 1
      ) {
        return true
      } else if (
        mode === 'tablet' &&
        breakpoint >= this.getBreakpoint('md') + 1 &&
        breakpoint < this.getBreakpoint('lg')
      ) {
        return true
      } else if (mode === 'mobile' && breakpoint <= this.getBreakpoint('md')) {
        return true
      } else if (
        mode === 'desktop-and-tablet' &&
        breakpoint >= this.getBreakpoint('md') + 1
      ) {
        return true
      } else if (
        mode === 'tablet-and-mobile' &&
        breakpoint <= this.getBreakpoint('lg')
      ) {
        return true
      } else if (
        mode === 'minimal-desktop-and-below' &&
        breakpoint <= this.getBreakpoint('xl')
      ) {
        return true
      }

      return false
    },

    /**
     * Generates unique ID for give prefix.
     * @param {string} prefix Prefix for generated ID
     * @returns {boolean}
     */
    getUniqueID(prefix) {
      return prefix + Math.floor(Math.random() * new Date().getTime())
    },

    /**
     * Gets window width for give breakpoint mode.
     * @param {string} mode Responsive mode name(e.g: xl, lg, md, sm)
     * @returns {number}
     */
    getBreakpoint(mode) {
      return breakpoints[mode]
    },

    /**
     * Checks whether object has property matchs given key path.
     * @param {object} obj Object contains values paired with given key path
     * @param {string} keys Keys path seperated with dots
     * @returns {object}
     */
    isset(obj, keys) {
      let stone

      keys = keys || ''

      if (keys.includes('[')) {
        throw new Error('Unsupported object path notation.')
      }

      keys = keys.split('.')

      do {
        if (obj === undefined) {
          return false
        }

        stone = keys.shift()

        if (!obj.hasOwnProperty(stone)) {
          return false
        }

        obj = obj[stone]
      } while (keys.length)

      return true
    },

    /**
     * Gets highest z-index of the given element parents
     * @param {object} el jQuery element object
     * @returns {number}
     */
    getHighestZindex(el) {
      let elem = KTUtil.get(el)
      let position
      let value

      while (elem && elem !== document) {
        // Ignore z-index if position is set to a value where z-index is ignored by the browser
        // This makes behavior of this function consistent across browsers
        // WebKit always returns auto if the element is positioned
        position = KTUtil.css(elem, 'position')

        if (
          position === 'absolute' ||
          position === 'relative' ||
          position === 'fixed'
        ) {
          // IE returns 0 when zIndex is not specified
          // other browsers return a string
          // we ignore the case of nested elements with an explicit value of 0
          // <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
          value = parseInt(KTUtil.css(elem, 'z-index'))

          if (!isNaN(value) && value !== 0) {
            return value
          }
        }

        elem = elem.parentNode
      }

      return null
    },

    /**
     * Checks whether the element has any parent with fixed positionfreg
     * @param {object} el jQuery element object
     * @returns {boolean}
     */
    hasFixedPositionedParent(el) {
      let position

      while (el && el !== document) {
        position = KTUtil.css(el, 'position')

        if (position === 'fixed') {
          return true
        }

        el = el.parentNode
      }

      return false
    },

    /**
     * Simulates delay
     */
    sleep(milliseconds) {
      const start = new Date().getTime()
      for (let i = 0; i < 1e7; i++) {
        if (new Date().getTime() - start > milliseconds) {
          break
        }
      }
    },

    /**
     * Gets randomly generated integer value within given min and max range
     * @param {number} min Range start value
     * @param {number} max Range end value
     * @returns {number}
     */
    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    },

    /**
     * Checks whether Angular library is included
     * @returns {boolean}
     */
    isAngularVersion() {
      return window.Zone !== undefined
    },

    // jQuery Workarounds

    // Deep extend:  $.extend(true, {}, objA, objB);
    deepExtend(out) {
      out = out || {}

      for (let i = 1; i < arguments.length; i++) {
        const obj = arguments[i]

        if (!obj) continue

        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object')
              out[key] = KTUtil.deepExtend(out[key], obj[key])
            else out[key] = obj[key]
          }
        }
      }

      return out
    },

    // extend:  $.extend({}, objA, objB);
    extend(out) {
      out = out || {}

      for (let i = 1; i < arguments.length; i++) {
        if (!arguments[i]) continue

        for (const key in arguments[i]) {
          if (arguments[i].hasOwnProperty(key)) out[key] = arguments[i][key]
        }
      }

      return out
    },

    get(query) {
      let el

      if (query === document) {
        return document
      }

      if (query && query.nodeType === 1) {
        return query
      }

      if ((el = document.getElementById(query))) {
        return el
      } else if (((el = document.getElementsByTagName(query)), el.length > 0)) {
        return el[0]
      } else if (
        ((el = document.getElementsByClassName(query)), el.length > 0)
      ) {
        return el[0]
      } else {
        return null
      }
    },

    getByID(query) {
      if (query && query.nodeType === 1) {
        return query
      }

      return document.getElementById(query)
    },

    getByTag(query) {
      let el

      if ((el = document.getElementsByTagName(query))) {
        return el[0]
      } else {
        return null
      }
    },

    getByClass(query) {
      let el

      if ((el = document.getElementsByClassName(query))) {
        return el[0]
      } else {
        return null
      }
    },

    /**
     * Checks whether the element has given classes
     * @param {object} el jQuery element object
     * @param {string} Classes string
     * @returns {boolean}
     */
    hasClasses(el, classes) {
      if (!el) {
        return
      }

      const classesArr = classes.split(' ')

      for (let i = 0; i < classesArr.length; i++) {
        if (KTUtil.hasClass(el, KTUtil.trim(classesArr[i])) === false) {
          return false
        }
      }

      return true
    },

    hasClass(el, className) {
      if (!el) {
        return
      }

      return el.classList
        ? el.classList.contains(className)
        : new RegExp('\\b' + className + '\\b').test(el.className)
    },

    addClass(el, className) {
      if (!el || typeof className === 'undefined') {
        return
      }

      const classNames = className.split(' ')

      if (el.classList) {
        for (let i = 0; i < classNames.length; i++) {
          if (classNames[i] && classNames[i].length > 0) {
            el.classList.add(KTUtil.trim(classNames[i]))
          }
        }
      } else if (!KTUtil.hasClass(el, className)) {
        for (let x = 0; x < classNames.length; x++) {
          el.className += ' ' + KTUtil.trim(classNames[x])
        }
      }
    },

    removeClass(el, className) {
      if (!el || typeof className === 'undefined') {
        return
      }

      const classNames = className.split(' ')

      if (el.classList) {
        for (let i = 0; i < classNames.length; i++) {
          el.classList.remove(KTUtil.trim(classNames[i]))
        }
      } else if (KTUtil.hasClass(el, className)) {
        for (let x = 0; x < classNames.length; x++) {
          el.className = el.className.replace(
            new RegExp('\\b' + KTUtil.trim(classNames[x]) + '\\b', 'g'),
            ''
          )
        }
      }
    },

    triggerCustomEvent(el, eventName, data) {
      let event
      if (window.CustomEvent) {
        event = new CustomEvent(eventName, {
          detail: data
        })
      } else {
        event = document.createEvent('CustomEvent')
        event.initCustomEvent(eventName, true, true, data)
      }

      el.dispatchEvent(event)
    },

    triggerEvent(node, eventName) {
      // Make sure we use the ownerDocument from the provided node to avoid cross-window problems
      let doc
      if (node.ownerDocument) {
        doc = node.ownerDocument
      } else if (node.nodeType === 9) {
        // the node may be the document itself, nodeType 9 = DOCUMENT_NODE
        doc = node
      } else {
        throw new Error('Invalid node passed to fireEvent: ' + node.id)
      }

      if (node.dispatchEvent) {
        // Gecko-style approach (now the standard) takes more work
        let eventClass = ''

        // Different events have different event classes.
        // If this switch statement can't map an eventName to an eventClass,
        // the event firing is going to fail.
        switch (eventName) {
          case 'click': // Dispatching of 'click' appears to not work correctly in Safari. Use 'mousedown' or 'mouseup' instead.
          case 'mouseenter':
          case 'mouseleave':
          case 'mousedown':
          case 'mouseup':
            eventClass = 'MouseEvents'
            break

          case 'focus':
          case 'change':
          case 'blur':
          case 'select':
            eventClass = 'HTMLEvents'
            break

          default:
            // eslint-disable-next-line no-throw-literal
            throw "fireEvent: Couldn't find an event class for event '" +
              eventName +
              "'."
            // eslint-disable-next-line no-unreachable
            break
        }
        // eslint-disable-next-line no-var
        var event = doc.createEvent(eventClass)

        const bubbles = eventName !== 'change'
        event.initEvent(eventName, bubbles, true) // All events created as bubbling and cancelable.

        event.synthetic = true // allow detection of synthetic events
        // The second parameter says go ahead with the default action
        node.dispatchEvent(event, true)
      } else if (node.fireEvent) {
        // IE-old school style
        // eslint-disable-next-line no-var,no-redeclare
        var event = doc.createEventObject()
        event.synthetic = true // allow detection of synthetic events
        node.fireEvent('on' + eventName, event)
      }
    },

    index(elm) {
      elm = KTUtil.get(elm)
      const c = elm.parentNode.children
      let i = 0
      for (; i < c.length; i++) if (c[i] === elm) return i
    },

    trim(string) {
      return string.trim()
    },

    eventTriggered(e) {
      if (e.currentTarget.dataset.triggered) {
        return true
      } else {
        e.currentTarget.dataset.triggered = true

        return false
      }
    },

    remove(el) {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el)
      }
    },

    find(parent, query) {
      parent = KTUtil.get(parent)
      if (parent) {
        return parent.querySelector(query)
      }
    },

    findAll(parent, query) {
      parent = KTUtil.get(parent)
      if (parent) {
        return parent.querySelectorAll(query)
      }
    },

    insertAfter(el, referenceNode) {
      return referenceNode.parentNode.insertBefore(
        el,
        referenceNode.nextSibling
      )
    },

    parents(elem, selector) {
      // Element.matches() polyfill
      if (!Element.prototype.matches) {
        Element.prototype.matches =
          Element.prototype.matchesSelector ||
          Element.prototype.mozMatchesSelector ||
          Element.prototype.msMatchesSelector ||
          Element.prototype.oMatchesSelector ||
          Element.prototype.webkitMatchesSelector ||
          function(s) {
            const matches = (
              this.document || this.ownerDocument
            ).querySelectorAll(s)
            let i = matches.length
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1
          }
      }

      // Set up a parent array
      const parents = []

      // Push each parent element to the array
      for (; elem && elem !== document; elem = elem.parentNode) {
        if (selector) {
          if (elem.matches(selector)) {
            parents.push(elem)
          }
          continue
        }
        parents.push(elem)
      }

      // Return our parent array
      return parents
    },

    children(el, selector, log) {
      if (!el || !el.childNodes) {
        return
      }

      const result = []
      // eslint-disable-next-line no-var
      var i = 0
      const l = el.childNodes.length

      // eslint-disable-next-line no-var,no-redeclare
      for (var i; i < l; ++i) {
        if (
          el.childNodes[i].nodeType === 1 &&
          KTUtil.matches(el.childNodes[i], selector, log)
        ) {
          result.push(el.childNodes[i])
        }
      }

      return result
    },

    child(el, selector, log) {
      const children = KTUtil.children(el, selector, log)

      return children ? children[0] : null
    },

    matches(el, selector, log) {
      const p = Element.prototype
      const f =
        p.matches ||
        p.webkitMatchesSelector ||
        p.mozMatchesSelector ||
        p.msMatchesSelector ||
        function(s) {
          return [].indexOf.call(document.querySelectorAll(s), this) !== -1
        }

      if (el && el.tagName) {
        return f.call(el, selector)
      } else {
        return false
      }
    },

    data(element) {
      element = KTUtil.get(element)

      return {
        set(name, data) {
          if (element === undefined) {
            return
          }

          if (element.customDataTag === undefined) {
            window.KTUtilElementDataStoreID++
            element.customDataTag = window.KTUtilElementDataStoreID
          }

          if (
            window.KTUtilElementDataStore[element.customDataTag] === undefined
          ) {
            window.KTUtilElementDataStore[element.customDataTag] = {}
          }

          window.KTUtilElementDataStore[element.customDataTag][name] = data
        },

        get(name) {
          if (element === undefined) {
            return
          }

          if (element.customDataTag === undefined) {
            return null
          }

          return this.has(name)
            ? window.KTUtilElementDataStore[element.customDataTag][name]
            : null
        },

        has(name) {
          if (element === undefined) {
            return false
          }

          if (element.customDataTag === undefined) {
            return false
          }

          return !!(
            window.KTUtilElementDataStore[element.customDataTag] &&
            window.KTUtilElementDataStore[element.customDataTag][name]
          )
        },

        remove(name) {
          if (element && this.has(name)) {
            delete window.KTUtilElementDataStore[element.customDataTag][name]
          }
        }
      }
    },

    outerWidth(el, margin) {
      let width

      if (margin === true) {
        width = parseFloat(el.offsetWidth)
        width +=
          parseFloat(KTUtil.css(el, 'margin-left')) +
          parseFloat(KTUtil.css(el, 'margin-right'))

        return parseFloat(width)
      } else {
        width = parseFloat(el.offsetWidth)

        return width
      }
    },

    offset(elem) {
      let rect, win
      elem = KTUtil.get(elem)

      if (!elem) {
        return
      }

      // Return zeros for disconnected and hidden (display: none) elements (gh-2310)
      // Support: IE <=11 only
      // Running getBoundingClientRect on a
      // disconnected node in IE throws an error

      if (!elem.getClientRects().length) {
        return { top: 0, left: 0 }
      }

      // Get document-relative position by adding viewport scroll to viewport-relative gBCR
      // eslint-disable-next-line prefer-const
      rect = elem.getBoundingClientRect()
      // eslint-disable-next-line prefer-const
      win = elem.ownerDocument.defaultView

      return {
        top: rect.top + win.pageYOffset,
        left: rect.left + win.pageXOffset
      }
    },

    height(el) {
      return KTUtil.css(el, 'height')
    },

    visible(el) {
      return !(el.offsetWidth === 0 && el.offsetHeight === 0)
    },

    attr(el, name, value) {
      el = KTUtil.get(el)

      if (el === undefined) {
        return
      }

      if (value !== undefined) {
        el.setAttribute(name, value)
      } else {
        return el.getAttribute(name)
      }
    },

    hasAttr(el, name) {
      el = KTUtil.get(el)

      if (el === undefined) {
        return
      }

      return !!el.getAttribute(name)
    },

    removeAttr(el, name) {
      el = KTUtil.get(el)

      if (el === undefined) {
        return
      }

      el.removeAttribute(name)
    },

    animate(from, to, duration, update, easing, done) {
      /**
       * TinyAnimate.easings
       *  Adapted from jQuery Easing
       */
      const easings = {}
      // eslint-disable-next-line no-redeclare,no-var
      var easing

      easings.linear = function(t, b, c, d) {
        return (c * t) / d + b
      }

      easing = easings.linear

      // Early bail out if called incorrectly
      if (
        typeof from !== 'number' ||
        typeof to !== 'number' ||
        typeof duration !== 'number' ||
        typeof update !== 'function'
      ) {
        return
      }

      // Create mock done() function if necessary
      if (typeof done !== 'function') {
        done = function() {}
      }

      // Pick implementation (requestAnimationFrame | setTimeout)
      const rAF =
        window.requestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 50)
        }

      // Animation loop
      // eslint-disable-next-line no-unused-vars
      const canceled = false
      const change = to - from

      function loop(timestamp) {
        const time = (timestamp || +new Date()) - start

        if (time >= 0) {
          update(easing(time, from, change, duration))
        }
        if (time >= 0 && time >= duration) {
          update(to)
          done()
        } else {
          rAF(loop)
        }
      }

      update(from)

      // Start animation loop
      // eslint-disable-next-line no-var
      var start =
        window.performance && window.performance.now
          ? window.performance.now()
          : +new Date()

      rAF(loop)
    },

    actualCss(el, prop, cache) {
      el = KTUtil.get(el)
      let css = ''

      if (el instanceof HTMLElement === false) {
        return
      }

      if (!el.getAttribute('kt-hidden-' + prop) || cache === false) {
        let value

        // the element is hidden so:
        // making the el block so we can meassure its height but still be hidden
        css = el.style.cssText
        el.style.cssText =
          'position: absolute; visibility: hidden; display: block;'

        if (prop === 'width') {
          value = el.offsetWidth
        } else if (prop === 'height') {
          value = el.offsetHeight
        }

        el.style.cssText = css

        // store it in cache
        el.setAttribute('kt-hidden-' + prop, value)

        return parseFloat(value)
      } else {
        // store it in cache
        return parseFloat(el.getAttribute('kt-hidden-' + prop))
      }
    },

    actualHeight(el, cache) {
      return KTUtil.actualCss(el, 'height', cache)
    },

    actualWidth(el, cache) {
      return KTUtil.actualCss(el, 'width', cache)
    },

    getScroll(element, method) {
      // The passed in `method` value should be 'Top' or 'Left'
      method = 'scroll' + method
      return element === window || element === document
        ? self[method === 'scrollTop' ? 'pageYOffset' : 'pageXOffset'] ||
            // eslint-disable-next-line no-undef
            (browserSupportsBoxModel && document.documentElement[method]) ||
            document.body[method]
        : element[method]
    },

    css(el, styleProp, value) {
      el = KTUtil.get(el)

      if (!el) {
        return
      }

      if (value !== undefined) {
        el.style[styleProp] = value
      } else {
        const defaultView = (el.ownerDocument || document).defaultView
        // W3C standard way:
        if (defaultView && defaultView.getComputedStyle) {
          // sanitize property name to css notation
          // (hyphen separated words eg. font-Size)
          styleProp = styleProp.replace(/([A-Z])/g, '-$1').toLowerCase()
          return defaultView
            .getComputedStyle(el, null)
            .getPropertyValue(styleProp)
        } else if (el.currentStyle) {
          // IE
          // sanitize property name to camelCase
          // eslint-disable-next-line no-useless-escape
          styleProp = styleProp.replace(/\-(\w)/g, function(str, letter) {
            return letter.toUpperCase()
          })
          value = el.currentStyle[styleProp]
          // convert other units to pixels on IE
          if (/^\d+(em|pt|%|ex)?$/i.test(value)) {
            return (function(value) {
              const oldLeft = el.style.left
              const oldRsLeft = el.runtimeStyle.left
              el.runtimeStyle.left = el.currentStyle.left
              el.style.left = value || 0
              value = el.style.pixelLeft + 'px'
              el.style.left = oldLeft
              el.runtimeStyle.left = oldRsLeft
              return value
            })(value)
          }
          return value
        }
      }
    },

    slide(el, dir, speed, callback, recalcMaxHeight) {
      if (
        !el ||
        (dir === 'up' && KTUtil.visible(el) === false) ||
        (dir === 'down' && KTUtil.visible(el) === true)
      ) {
        return
      }

      speed = speed || 600
      const calcHeight = KTUtil.actualHeight(el)
      let calcPaddingTop = false
      let calcPaddingBottom = false

      if (
        KTUtil.css(el, 'padding-top') &&
        KTUtil.data(el).has('slide-padding-top') !== true
      ) {
        KTUtil.data(el).set('slide-padding-top', KTUtil.css(el, 'padding-top'))
      }

      if (
        KTUtil.css(el, 'padding-bottom') &&
        KTUtil.data(el).has('slide-padding-bottom') !== true
      ) {
        KTUtil.data(el).set(
          'slide-padding-bottom',
          KTUtil.css(el, 'padding-bottom')
        )
      }

      if (KTUtil.data(el).has('slide-padding-top')) {
        calcPaddingTop = parseInt(KTUtil.data(el).get('slide-padding-top'))
      }

      if (KTUtil.data(el).has('slide-padding-bottom')) {
        calcPaddingBottom = parseInt(
          KTUtil.data(el).get('slide-padding-bottom')
        )
      }

      if (dir === 'up') {
        // up
        el.style.cssText = 'display: block; overflow: hidden;'

        if (calcPaddingTop) {
          KTUtil.animate(
            0,
            calcPaddingTop,
            speed,
            function(value) {
              el.style.paddingTop = calcPaddingTop - value + 'px'
            },
            'linear'
          )
        }

        if (calcPaddingBottom) {
          KTUtil.animate(
            0,
            calcPaddingBottom,
            speed,
            function(value) {
              el.style.paddingBottom = calcPaddingBottom - value + 'px'
            },
            'linear'
          )
        }

        KTUtil.animate(
          0,
          calcHeight,
          speed,
          function(value) {
            el.style.height = calcHeight - value + 'px'
          },
          'linear',
          function() {
            callback()
            el.style.height = ''
            el.style.display = 'none'
          }
        )
      } else if (dir === 'down') {
        // down
        el.style.cssText = 'display: block; overflow: hidden;'

        if (calcPaddingTop) {
          KTUtil.animate(
            0,
            calcPaddingTop,
            speed,
            function(value) {
              el.style.paddingTop = value + 'px'
            },
            'linear',
            function() {
              el.style.paddingTop = ''
            }
          )
        }

        if (calcPaddingBottom) {
          KTUtil.animate(
            0,
            calcPaddingBottom,
            speed,
            function(value) {
              el.style.paddingBottom = value + 'px'
            },
            'linear',
            function() {
              el.style.paddingBottom = ''
            }
          )
        }

        KTUtil.animate(
          0,
          calcHeight,
          speed,
          function(value) {
            el.style.height = value + 'px'
          },
          'linear',
          function() {
            callback()
            el.style.height = ''
            el.style.display = ''
            el.style.overflow = ''
          }
        )
      }
    },

    slideUp(el, speed, callback) {
      KTUtil.slide(el, 'up', speed, callback)
    },

    slideDown(el, speed, callback) {
      KTUtil.slide(el, 'down', speed, callback)
    },

    show(el, display) {
      if (typeof el !== 'undefined') {
        el.style.display = display || 'block'
      }
    },

    hide(el) {
      if (typeof el !== 'undefined') {
        el.style.display = 'none'
      }
    },

    addEvent(el, type, handler, one) {
      el = KTUtil.get(el)

      if (typeof el !== 'undefined' && el !== null) {
        el.addEventListener(type, handler)
      }
    },

    removeEvent(el, type, handler) {
      el = KTUtil.get(el)

      if (el !== null) {
        el.removeEventListener(type, handler)
      }
    },

    on(element, selector, event, handler) {
      if (!selector) {
        return
      }

      const eventId = KTUtil.getUniqueID('event')

      window.KTUtilDelegatedEventHandlers[eventId] = function(e) {
        const targets = element.querySelectorAll(selector)
        let target = e.target

        while (target && target !== element) {
          for (let i = 0, j = targets.length; i < j; i++) {
            if (target === targets[i]) {
              handler.call(target, e)
            }
          }

          target = target.parentNode
        }
      }

      KTUtil.addEvent(
        element,
        event,
        window.KTUtilDelegatedEventHandlers[eventId]
      )

      return eventId
    },

    off(element, event, eventId) {
      if (!element || !window.KTUtilDelegatedEventHandlers[eventId]) {
        return
      }

      KTUtil.removeEvent(
        element,
        event,
        window.KTUtilDelegatedEventHandlers[eventId]
      )

      delete window.KTUtilDelegatedEventHandlers[eventId]
    },

    one: function onetime(el, type, callback) {
      el = KTUtil.get(el)

      el.addEventListener(type, function callee(e) {
        // remove event
        if (e.target && e.target.removeEventListener) {
          e.target.removeEventListener(e.type, callee)
        }

        // call handler
        return callback(e)
      })
    },

    hash(str) {
      let hash = 0
      let i
      let chr

      if (str.length === 0) return hash
      for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i)
        hash = (hash << 5) - hash + chr
        hash |= 0 // Convert to 32bit integer
      }

      return hash
    },

    animateClass(el, animationName, callback) {
      let animation
      const animations = {
        animation: 'animationend',
        OAnimation: 'oAnimationEnd',
        MozAnimation: 'mozAnimationEnd',
        WebkitAnimation: 'webkitAnimationEnd',
        msAnimation: 'msAnimationEnd'
      }

      for (const t in animations) {
        if (el.style[t] !== undefined) {
          animation = animations[t]
        }
      }

      KTUtil.addClass(el, 'animated ' + animationName)

      KTUtil.one(el, animation, function() {
        KTUtil.removeClass(el, 'animated ' + animationName)
      })

      if (callback) {
        KTUtil.one(el, animation, callback)
      }
    },

    transitionEnd(el, callback) {
      let transition
      const transitions = {
        transition: 'transitionend',
        OTransition: 'oTransitionEnd',
        MozTransition: 'mozTransitionEnd',
        WebkitTransition: 'webkitTransitionEnd',
        msTransition: 'msTransitionEnd'
      }

      for (const t in transitions) {
        if (el.style[t] !== undefined) {
          transition = transitions[t]
        }
      }

      KTUtil.one(el, transition, callback)
    },

    animationEnd(el, callback) {
      let animation
      const animations = {
        animation: 'animationend',
        OAnimation: 'oAnimationEnd',
        MozAnimation: 'mozAnimationEnd',
        WebkitAnimation: 'webkitAnimationEnd',
        msAnimation: 'msAnimationEnd'
      }

      for (const t in animations) {
        if (el.style[t] !== undefined) {
          animation = animations[t]
        }
      }

      KTUtil.one(el, animation, callback)
    },

    animateDelay(el, value) {
      const vendors = ['webkit-', 'moz-', 'ms-', 'o-', '']
      for (let i = 0; i < vendors.length; i++) {
        KTUtil.css(el, vendors[i] + 'animation-delay', value)
      }
    },

    animateDuration(el, value) {
      const vendors = ['webkit-', 'moz-', 'ms-', 'o-', '']
      for (let i = 0; i < vendors.length; i++) {
        KTUtil.css(el, vendors[i] + 'animation-duration', value)
      }
    },

    scrollTo(target, offset, duration) {
      // eslint-disable-next-line no-var,no-redeclare
      var duration = duration || 500
      // eslint-disable-next-line no-var,no-redeclare
      var target = KTUtil.get(target)
      const targetPos = target ? KTUtil.offset(target).top : 0
      const scrollPos =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0
      let from, to

      if (targetPos > scrollPos) {
        from = targetPos
        to = scrollPos
      } else {
        from = scrollPos
        to = targetPos
      }

      if (offset) {
        to += offset
      }

      KTUtil.animate(from, to, duration, function(value) {
        document.documentElement.scrollTop = value
        document.body.parentNode.scrollTop = value
        document.body.scrollTop = value
      }) //, easing, done
    },

    scrollTop(offset, duration) {
      KTUtil.scrollTo(null, offset, duration)
    },

    isArray(obj) {
      return obj && Array.isArray(obj)
    },

    ready(callback) {
      if (process.client) {
        if (
          document.attachEvent
            ? document.readyState === 'complete'
            : document.readyState !== 'loading'
        ) {
          callback()
        } else {
          document.addEventListener('DOMContentLoaded', callback)
        }
      }
    },

    isEmpty(obj) {
      for (const prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          return false
        }
      }

      return true
    },

    numberString(nStr) {
      nStr += ''
      const x = nStr.split('.')
      let x1 = x[0]
      const x2 = x.length > 1 ? '.' + x[1] : ''
      const rgx = /(\d+)(\d{3})/
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2')
      }
      return x1 + x2
    },

    detectIE() {
      const ua = window.navigator.userAgent

      // Test values; Uncomment to check result …

      // IE 10
      // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

      // IE 11
      // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

      // Edge 12 (Spartan)
      // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

      // Edge 13
      // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

      const msie = ua.indexOf('MSIE ')
      if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10)
      }

      const trident = ua.indexOf('Trident/')
      if (trident > 0) {
        // IE 11 => return version number
        const rv = ua.indexOf('rv:')
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10)
      }

      const edge = ua.indexOf('Edge/')
      if (edge > 0) {
        // Edge (IE 12+) => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10)
      }

      // other browser
      return false
    },

    isRTL() {
      return KTUtil.attr(KTUtil.get('html'), 'direction') === 'rtl'
    },

    //

    // Scroller
    scrollInit(element, options) {
      if (!element) return
      // Define init function
      function init() {
        let ps
        let height

        if (options.height instanceof Function) {
          height = parseInt(options.height.call())
        } else {
          height = parseInt(options.height)
        }

        // Destroy scroll on table and mobile modes
        if (
          (options.mobileNativeScroll || options.disableForMobile) &&
          KTUtil.isInResponsiveRange('tablet-and-mobile')
        ) {
          ps = KTUtil.data(element).get('ps')
          if (ps) {
            if (options.resetHeightOnDestroy) {
              KTUtil.css(element, 'height', 'auto')
            } else {
              KTUtil.css(element, 'overflow', 'auto')
              if (height > 0) {
                KTUtil.css(element, 'height', height + 'px')
              }
            }

            ps.destroy()
            ps = KTUtil.data(element).remove('ps')
          } else if (height > 0) {
            KTUtil.css(element, 'overflow', 'auto')
            KTUtil.css(element, 'height', height + 'px')
          }

          return
        }

        if (height > 0) {
          KTUtil.css(element, 'height', height + 'px')
        }

        if (options.desktopNativeScroll) {
          KTUtil.css(element, 'overflow', 'auto')
          return
        }

        // Init scroll
        KTUtil.css(element, 'overflow', 'hidden')

        ps = KTUtil.data(element).get('ps')
        if (ps) {
          ps.update()
        } else {
          KTUtil.addClass(element, 'kt-scroll')
          // eslint-disable-next-line no-undef
          ps = new PerfectScrollbar(element, {
            wheelSpeed: 0.5,
            swipeEasing: true,
            wheelPropagation: options.windowScroll !== false,
            minScrollbarLength: 40,
            maxScrollbarLength: 300,
            suppressScrollX: KTUtil.attr(element, 'data-scroll-x') !== 'true'
          })

          KTUtil.data(element).set('ps', ps)
        }

        // Remember scroll position in cookie
        const uid = KTUtil.attr(element, 'id')

        // eslint-disable-next-line no-undef
        if (options.rememberPosition === true && Cookies && uid) {
          // eslint-disable-next-line no-undef
          if (Cookies.get(uid)) {
            // eslint-disable-next-line no-undef
            const pos = parseInt(Cookies.get(uid))

            if (pos > 0) {
              element.scrollTop = pos
            }
          }

          element.addEventListener('ps-scroll-y', function() {
            // eslint-disable-next-line no-undef
            Cookies.set(uid, element.scrollTop)
          })
        }
      }

      // Init
      init()

      // Handle window resize
      if (options.handleWindowResize) {
        KTUtil.addResizeHandler(function() {
          init()
        })
      }
    },

    scrollUpdate(element) {
      const ps = KTUtil.data(element).get('ps')
      if (ps) {
        ps.update()
      }
    },

    scrollUpdateAll(parent) {
      const scrollers = KTUtil.findAll(parent, '.ps')
      for (let i = 0, len = scrollers.length; i < len; i++) {
        KTUtil.scrollUpdate(scrollers[i])
      }
    },

    scrollDestroy(element) {
      let ps = KTUtil.data(element).get('ps')
      if (ps) {
        ps.destroy()
        ps = KTUtil.data(element).remove('ps')
      }
    },

    setHTML(el, html) {
      if (KTUtil.get(el)) {
        KTUtil.get(el).innerHTML = html
      }
    },

    getHTML(el) {
      if (KTUtil.get(el)) {
        return KTUtil.get(el).innerHTML
      }
    },

    getDocumentHeight() {
      const body = document.body
      const html = document.documentElement

      return Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      )
    },

    getScrollTop() {
      return (document.scrollingElement || document.documentElement).scrollTop
    }
  }
})()

// webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = KTUtil
}

// Initialize KTUtil class on document ready
KTUtil.ready(function() {
  KTUtil.init()
})

// CSS3 Transitions only after page load(.kt-page-loading class added to body tag and remove with JS on page load)
if (process.client) {
  window.onload = function() {
    KTUtil.removeClass(KTUtil.get('body'), 'kt-page--loading')
  }
}

export default KTUtil
