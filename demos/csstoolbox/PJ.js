// Improvements/bug-fixes since book publication.
//
// Use of the 'backgroundColor' property has been replaced with
// 'background' because it works exactly the same way when used
// with a color, and is therefore shorter and faster.
//
// In Initialize() the mouse is also captured by the onscroll
// event (and by the onmousewheel event for IE), so that using
// a mouse scroll wheel is also captured.
//
// The O() function now handles certain object cases better.
//
// In the function CleanupString() the spacestosingle option
// has been improved to work with all whitespace.
//
// For Opera & Chrome: The FieldPrompt() function forces the width
// of the input to the current width to prevent these browsers
// changing the width as they switch between normal and italic
// text.
//
// The Ajax functions had a spurious ID argument left in from
// earlier versions, which is now removed.
//
// Amended TextType() to use Html not .innerText for IE
//
// Added OnDOMReady() function - much faster than window.onload

function O(id, property, value)
{
   if (id instanceof Array)
   {
      var tmp = []
      for (var j = 0 ; j < id.length ; ++j)
         tmp.push(O(id[j], property, value))
      return tmp
   }

   if (typeof property !=  UNDEF && typeof value != UNDEF)
   {
      if (typeof value == 'string') value = "'" + value + "'"
      if (typeof id == 'object') return eval(id.property = value)
      else return eval("O('" + id + "')." + property + " = " + value)
   }

   if (typeof id == 'object') return id
   else
   {
      try { return document.getElementById(id) }
      catch(e) { alert('PJ - Unknown ID: ' + id) }
   }
}

function S(id, property, value)
{
   if (id instanceof Array)
   {
      var tmp = []
      for (var j = 0 ; j < id.length ; ++j)
         tmp.push(S(id[j], property, value))
      return tmp
   }

   if (typeof property != UNDEF && typeof value != UNDEF)
   {
      try { return O(id).style[property] = value }
      catch(e) { alert('PJ - Unknown ID: ' + id) }
   }
   else if (typeof id == 'object') return id.style
   else
   {
      try { return O(id).style }
      catch(e) { alert('PJ - Unknown ID: ' + id) }
   }
}

function Initialize()
{
   MOUSE_DOWN  = false
   MOUSE_IN    = true
   MOUSE_X     = 0
   MOUSE_Y     = 0
   SCROLL_X    = 0
   SCROLL_Y    = 0
   KEY_PRESS   = ''
   ZINDEX      = 1000
   CHAIN_CALLS = []
   INTERVAL    = 30

   UNDEF = 'undefined'
   HID   = 'hidden'
   VIS   = 'visible'
   ABS   = 'absolute'
   FIX   = 'fixed'
   REL   = 'relative'
   STA   = 'static'
   INH   = 'inherit'
   TP    = 'top'
   BM    = 'bottom'
   LT    = 'left'
   RT    = 'right'

   if      (document.all)        BROWSER = 'IE'
   else if (window.opera)        BROWSER = 'Opera'
   else if (NavCheck('Chrome'))  BROWSER = 'Chrome' 
   else if (NavCheck('iPod'))    BROWSER = 'iPod'
   else if (NavCheck('iPhone'))  BROWSER = 'iPhone'
   else if (NavCheck('iPad'))    BROWSER = 'iPad'
   else if (NavCheck('Android')) BROWSER = 'Android'
   else if (NavCheck('Safari'))  BROWSER = 'Safari'
   else if (NavCheck('Gecko'))   BROWSER = 'Firefox'
   else                          BROWSER = 'UNKNOWN'

   document.onmousemove  = CaptureMouse
   document.onscroll     = CaptureMouse
   document.onmousewheel = CaptureMouse
   document.onkeydown    = CaptureKeyboard
   document.onkeypress   = CaptureKeyboard

   document.onmouseout  = function() { MOUSE_IN   = false }
   document.onmouseover = function() { MOUSE_IN   = true  }
   document.onmouseup   = function() { MOUSE_DOWN = false }
   document.onmousedown = function() { MOUSE_DOWN = true  }
   
   function NavCheck(check)
   {
      return navigator.userAgent.indexOf(check)  != -1
   }
}

function CaptureMouse(e)
{
   if (BROWSER == 'IE')
   {
      SCROLL_X = document.documentElement.scrollLeft
      SCROLL_Y = document.documentElement.scrollTop
      MOUSE_X  = window.event.clientX + SCROLL_X
      MOUSE_Y  = window.event.clientY + SCROLL_Y
   }
   else
   {
      SCROLL_X = window.pageXOffset
      SCROLL_Y = window.pageYOffset
      MOUSE_X  = e.pageX
      MOUSE_Y  = e.pageY
   }

   return true
}

function CaptureKeyboard(e)
{
   if (BROWSER == 'IE')
   {
      KEY_PRESS = FromKeyCode(window.event.keyCode)

      if (KEY_PRESS > 0)
         KEY_PRESS = String.fromCharCode(KEY_PRESS)
   }
   else
   {
      if      (e.charCode) KEY_PRESS = String.fromCharCode(e.charCode)
      else if (e.keyCode)  KEY_PRESS = FromKeyCode(e.keyCode)
   }
   
   return true
}

function FromKeyCode(c)
{
   switch (c)
   {
      case   8: return 'Backspace'
      case   9: return 'Tab'
      case  12: return 'Center'
      case  13: return 'Enter'
      case  16: return 'Shift'
      case  17: return 'Control'
      case  18: return 'Alt'
      case  19: return 'Pause'
      case  20: return 'Capslock'
      case  27: return 'Esc'
      case  33: return 'PgUp'
      case  34: return 'PgDn'
      case  35: return 'End'
      case  36: return 'Home'
      case  37: return 'left'
      case  38: return 'Up'
      case  39: return 'Right'
      case  40: return 'Down'
      case  45: return 'Ins'
      case  46: return 'Del'
      case  91: return 'Windows'
      case  93: return 'Menu'
      case 144: return 'Numlock'
   }

   return c
}

function GetLastKey()
{
   var k = KEY_PRESS
   KEY_PRESS = ''

   return k
}

function PreventAction(id, type, onoff)
{
   if (type == 'drag' || type == 'both')
   {
      if (onoff == true)
      {
         if (typeof O(id).ondragstart != UNDEF)
            O(id).ondragstart   = function() { return false }
         else O(id).onmousedown = function() { return false }
      }
      else
      {
         if (typeof O(id).ondragstart != UNDEF)
              O(id).ondragstart = ''
         else O(id).onmousedown = ''
      }
   }

   if (type == 'select' || type == 'both')
   {
      if (onoff == true)
      {
         if (typeof O(id).onselectstart != UNDEF)
            O(id).onselectstart = function() { return false }
         else if (typeof S(id).MozUserSelect != UNDEF)
            S(id).MozUserSelect = 'none'
         else O(id).onmousedown = function() { return false }
      }
      else
      {
         if (typeof O(id).onselectstart != UNDEF)
            O(id).onselectstart = ''
         else if (typeof S(id).MozUserSelect != UNDEF)
            S(id).MozUserSelect = 'text'
         else O(id).onmousedown = ''
      }
   }
}

function NoPx(value)
{
   return value.replace(/px/, '') * 1
}

function Px(value)
{
   return value + 'px'
}

function X(id)
{
   var obj    = O(id)
   var offset = obj.offsetLeft

   if (obj.offsetParent)
      while(obj = obj.offsetParent)
         offset += obj.offsetLeft

   return offset
}

function Y(id)
{
   var obj    = O(id)
   var offset = obj.offsetTop

   if (obj.offsetParent)
      while(obj = obj.offsetParent)
         offset += obj.offsetTop

   return offset
}

function W(id)
{
   var width = O(id).offsetWidth +
               NoPx(S(id).marginLeft) +
               NoPx(S(id).marginRight)

   var bord  = NoPx(S(id).borderLeftWidth) +
               NoPx(S(id).borderRightWidth)

   if (bord > 0)           width -= bord
   else  if (O(id).border) width -= O(id).border * 2

   return width
}

function H(id)
{
   var height = O(id).offsetHeight +
                NoPx(S(id).marginTop) +
                NoPx(S(id).marginBottom)

   var bord   = NoPx(S(id).borderTopWidth) +
                NoPx(S(id).borderBottomWidth)

   if (bord > 0)         height -= bord
   else if(O(id).border) height -= O(id).border * 2

   return height
}

function Html(id, value)
{
   if (typeof value != UNDEF)
      O(id).innerHTML = value
   return O(id).innerHTML
}

function SaveState(id)
{
   O(id).Save_left          = S(id).left
   O(id).Save_top           = S(id).top
   O(id).Save_visibility    = S(id).visibility
   O(id).Save_color         = S(id).color
   O(id).Save_background    = S(id).background
   O(id).Save_display       = S(id).display
   O(id).Save_opacity       = S(id).opacity
   O(id).Save_MozOpacity    = S(id).MozOpacity
   O(id).Save_KhtmlOpacity  = S(id).KhtmlOpacity
   O(id).Save_filter        = S(id).filter
   O(id).Save_zIndex        = S(id).zIndex
}

function RestoreState(id)
{
   S(id).left         = O(id).Save_left
   S(id).top          = O(id).Save_top
   S(id).visibility   = O(id).Save_visibility
   S(id).color        = O(id).Save_color
   S(id).background   = O(id).Save_background
   S(id).display      = O(id).Save_display
   S(id).opacity      = O(id).Save_opacity
   S(id).MozOpacity   = O(id).Save_MozOpacity
   S(id).KhtmlOpacity = O(id).Save_KhtmlOpacity
   S(id).filter       = O(id).Save_filter
   S(id).zIndex       = O(id).Save_zIndex
}

function InsVars()
{
   var tmp = arguments[0]

   for (var j = 1 ; j < arguments.length ; ++j)
      tmp = tmp.replace(new RegExp('#' + j, 'g'), arguments[j])
   return tmp
}

function StrRepeat(str, num)
{
   var tmp = ''

   for (var j = 0 ; j < num ; ++j)
      tmp += str

   return tmp
}

function HexDec(n)
{
   return(parseInt(n, 16))
}

function DecHex(n)
{
   return (n < 16 ? '0' : '') + n.toString(16)
}

function ResizeWidth(id, width)
{
   S(id, 'overflow', HID)
   S(id, 'width',    Px(width))
}

function ResizeHeight(id, height)
{
   S(id, 'overflow', HID)
   S(id, 'height',   Px(height))
}

function Resize(id, width, height)
{
   ResizeWidth(id,  width)
   ResizeHeight(id, height)
}

function Position(id, type)
{
   S(id, 'position', type)
}

function GoTo(id, x, y)
{
   S(id, 'left', Px(x))
   S(id, 'top',  Px(y))
}

function Locate(id, type, x, y)
{
   Position(id, type)
   GoTo(id, x, y)
}

function GetWindowWidth()
{
   var de = document.documentElement

   if (BROWSER != 'IE')
   {
      var barwidth = de.scrollHeight > de.clientHeight ? 17 : 0
      return window.innerWidth - barwidth
   }

   return de.clientWidth || document.body.clientWidth
}

function GetWindowHeight()
{
   var de = document.documentElement

   if (BROWSER != 'IE')
   {
      var barwidth = de.scrollWidth > de.clientWidth ? 17 : 0
      return window.innerHeight - barwidth
   }

   return de.clientHeight || document.body.clientHeight
}

function GoToEdge(id, where, percent)
{
   if (id instanceof Array)
   {
      for (var j = 0 ; j < id.length ; ++j)
         GoToEdge(id[j], where, percent)
      return
   }

   var width  = GetWindowWidth()  - W(id)
   var height = GetWindowHeight() - H(id)
   var amount = percent / 100

   switch(where)
   {
      case TP: var x = width * amount
               var y = 0
               break
      case BM: var x = width * amount
               var y = height
               break
      case LT: var x = 0
               var y = height * amount
               break
      case RT: var x = width
               var y = height * amount
   }

   GoTo(id, x, y)
}

function CenterX(id)
{
   if (id instanceof Array)
   {
      for (var j = 0 ; j < id.length ; ++j)
         CenterX(id[j])
      return
   }

   S(id).left = Px(Math.round((GetWindowWidth() - W(id))) / 2 + SCROLL_X)
}

function CenterY(id)
{
   if (id instanceof Array)
   {
      for (var j = 0 ; j < id.length ; ++j)
         CenterY(id[j])
      return
   }

   S(id).top = Px(Math.round((GetWindowHeight() - H(id))) / 2 + SCROLL_Y)
}

function Center(id)
{
   CenterX(id)
   CenterY(id)
}

function Invisible(id)
{
   S(id, 'visibility', HID)
}

function Visible(id)
{
   S(id, 'visibility', VIS)
}

function VisibilityToggle(id)
{
   if (id instanceof Array)
   {
      for (var j = 0 ; j < id.length ; ++j)
         VisibilityToggle(id[j])
      return
   }

   S(id).visibility = (S(id).visibility == HID) ? VIS : HID
}

function Opacity(id, percent)
{
   S(id, 'opacity',      percent / 100)
   S(id, 'MozOpacity',   percent / 100)
   S(id, 'KhtmlOpacity', percent / 100)
   S(id, 'filter',       InsVars("alpha(opacity = '#1')", percent))
}

function Fade(id, start, end, msecs, interruptible, CB)
{
   if (id instanceof Array)
   {
      for (var j = 0 ; j < id.length ; ++j)
         Fade(id[j], start, end, msecs, interruptible, CB)
      return
   }
 
   var stepval = Math.abs(start - end) / (msecs / INTERVAL)
   
   if (O(id).FA_Flag)
   {
      if (!O(id).FA_Int) return

      clearInterval(O(id).FA_IID)
      O(id).FA_Start = O(id).FA_Level
   }
   else
   {
      O(id).FA_Start = start
      O(id).FA_Level = start
   }

   O(id).FA_Flag = true
   O(id).FA_End  = end
   O(id).FA_Int  = interruptible
   O(id).FA_Step = end > O(id).FA_Start ? stepval : -stepval
   O(id).Fadeout = end < O(id).FA_Start ? true : false
   O(id).FA_IID  = setInterval(DoFade, INTERVAL)

   function DoFade()
   {
      O(id).FA_Level += O(id).FA_Step

      if (O(id).FA_Level >= Math.max(O(id).FA_Start, O(id).FA_End) ||
          O(id).FA_Level <= Math.min(O(id).FA_Start, O(id).FA_End))
      {
         O(id).FA_Level = O(id).FA_End
         O(id).FA_Flag  = false
         clearInterval(O(id).FA_IID)
         if (typeof CB != UNDEF) eval(CB)
      }

      Opacity(id, O(id).FA_Level)
   }
}

function FadeOut(id, msecs, interruptible, CB)
{
   Fade(id, 100, 0, msecs, interruptible, CB)
}

function FadeIn(id, msecs, interruptible, CB)
{
  Fade(id, 0, 100, msecs, interruptible, CB)
}

function FadeToggle(id, msecs, interruptible, CB)
{
   if (id instanceof Array)
   {
      for (var j = 0 ; j < id.length ; ++j)
         FadeToggle(id[j], msecs, interruptible, CB)
      return
   }

   if (O(id).Fadeout) FadeIn( id, msecs, interruptible, CB)
   else               FadeOut(id, msecs, interruptible, CB)
}

function FadeBetween(id1, id2, msecs, interruptible, CB)
{
   FadeOut(id1, msecs, interruptible, CB)
   FadeIn( id2, msecs, interruptible, CB)
}

function Hide(id, CB)
{
   S(id, 'display', 'none')
   O(id, 'HI_Flag', true)

   if (typeof CB != UNDEF) eval(CB)
}

function Show(id, CB)
{
   S(id, 'display', 'block')
   O(id, 'HI_Flag', false)
}

function HideToggle(id, CB)
{
   if (id instanceof Array)
   {
      for (var j = 0 ; j < id.length ; ++j)
         HideToggle(id[j], CB)
      return
   }

   if (S(id).display != 'none') Hide(id, CB)
   else Show(id, CB)
}

function Slide(id, frx, fry, tox, toy, msecs, interruptible, CB)
{
   if (O(id).SL_Flag)
   {
      if (!O(id).SL_Int) return
      else clearInterval(O(id).SL_IID)

      var len1  = Distance(tox - frx, toy - fry)
      frx       = X(id)
      fry       = Y(id)
      var len2  = Distance(tox - frx, toy - fry)
      msecs    *= len2 / len1
   }

   var stepx = (tox - frx) / (msecs / INTERVAL)
   var stepy = (toy - fry) / (msecs / INTERVAL)

   var count     = 0
   O(id).SL_Int  = interruptible
   O(id).SL_Flag = true
   O(id).SL_IID  = setInterval(DoSlide, INTERVAL)

   function Distance(x, y)
   {
      x = Math.max(1, x)
      y = Math.max(1, y)
      return Math.round(Math.sqrt(Math.abs(x * x) + Math.abs(y * y)))
   }

   function DoSlide()
   {
      GoTo(id, frx + stepx * count, fry + stepy * count)
      
      if (count++ >= (msecs / INTERVAL))
      {
         O(id).SL_Flag = false
         GoTo(id, tox, toy)
         clearInterval(O(id).SL_IID)
         if (typeof CB != UNDEF) eval(CB)
      }
   }
}

function SlideBetween(id1, id2, msecs, interruptible, CB)
{
   if (O(id1).SL_Flag || O(id2).SL_Flag)
   {
      if (!O(id1).SL_Int || !O(id2).SL_Int)
         return

      var t1      = O(id1).SB_X
      var t2      = O(id1).SB_Y
      O(id1).SB_X = O(id2).SB_X
      O(id1).SB_Y = O(id2).SB_Y
      O(id2).SB_X = t1
      O(id2).SB_Y = t2 
   }
   else
   {
      O(id1).SB_X = X(id1)
      O(id1).SB_Y = Y(id1)
      O(id2).SB_X = X(id2)
      O(id2).SB_Y = Y(id2)
   }

   var x1 = O(id1).SB_X
   var y1 = O(id1).SB_Y
   var x2 = O(id2).SB_X
   var y2 = O(id2).SB_Y

   Slide(id1, x1, y1, x2, y2, msecs, interruptible, CB)
   Slide(id2, x2, y2, x1, y1, msecs, interruptible, CB)
}

function Deflate(id, w, h, msecs, interruptible, CB)
{
   if (id instanceof Array)
   {
      for (var j = 0 ; j < id.length ; ++j)
         Deflate(id[j], w, h, msecs, interruptible, CB)
      return
   }

   if (!w) ResizeWidth( id, W(id))
   if (!h) ResizeHeight(id, H(id))

   if (O(id).DF_Flag)
   {
      if (!O(id).DF_Int) return
      else clearInterval(O(id).DF_IID)
   }
   else
   {
      if (w) O(id).DF_OldW  = W(id)
      if (h) O(id).DF_OldH  = H(id)
      O(id).DF_Count = msecs / INTERVAL
   }
   
   var stepw = O(id).DF_OldW / (msecs / INTERVAL)
   var steph = O(id).DF_OldH / (msecs / INTERVAL)
   
   S(id).overflow = HID
   O(id).Deflated = true
   O(id).DF_Flag  = true
   O(id).DF_Int   = interruptible
   O(id).DF_IID   = setInterval(DoDeflate, INTERVAL)
   
   function DoDeflate()
   {
      if (w) ResizeWidth( id, stepw * O(id).DF_Count) 
      if (h) ResizeHeight(id, steph * O(id).DF_Count)

      if (O(id).DF_Count-- < 1)
      {
         O(id).DF_Flag = false

         if (w) ResizeWidth( id, 0)
         if (h) ResizeHeight(id, 0)

         clearInterval(O(id).DF_IID)
         if (typeof CB != UNDEF) eval(CB)
      }
   }
}

function Reflate(id, w, h, msecs, interruptible, CB)
{
   if (id instanceof Array)
   {
      for (var j = 0 ; j < id.length ; ++j)
         Reflate(id[j], w, h, msecs, interruptible, CB)
      return
   }

   if (!O(id).Deflated) return
   else if (O(id).DF_Flag)
   {
      if (!O(id).DF_Int) return
      else clearInterval(O(id).DF_IID)
   }
   else O(id).DF_Count = 0

   var stepw  = O(id).DF_OldW / (msecs / INTERVAL)
   var steph  = O(id).DF_OldH / (msecs / INTERVAL)

   O(id).DF_Flag  = true
   O(id).Deflated = false
   O(id).DF_Int   = interruptible
   O(id).DF_IID   = setInterval(DoReflate, INTERVAL)

   function DoReflate()
   {
      if (w) ResizeWidth( id, stepw * O(id).DF_Count) 
      if (h) ResizeHeight(id, steph * O(id).DF_Count)
      
      if (O(id).DF_Count++ >= msecs / INTERVAL)
      {
         O(id).DF_Flag = false

         if (w) ResizeWidth( id, O(id).DF_OldW)
         if (h) ResizeHeight(id, O(id).DF_OldH)

         clearInterval(O(id).DF_IID)
         if (typeof CB != UNDEF) eval(CB)
      }
   }
}

function DeflateToggle(id, w, h, msecs, interruptible, CB)
{
   if (id instanceof Array)
   {
      for (var j = 0 ; j < id.length ; ++j)
         DeflateToggle(id[j], w, h, msecs, interruptible, CB)
      return
   }

   if (O(id).Deflated) Reflate(id, w, h, msecs, interruptible, CB)
   else                Deflate(id, w, h, msecs, interruptible, CB)
}

function DeflateBetween(id1, id2, w, h, msecs, interruptible, CB)
{
   Deflate(id1, w, h, msecs, interruptible, CB)
   Reflate(id2, w, h, msecs, interruptible, CB)
}

function Zoom(id, w, h, fromw, fromh, tow, toh,
   msecs, pad, interruptible, CB)
{
   if (id instanceof Array)
   {
      for (var j = 0 ; j < id.length ; ++j)
         Zoom(id[j], w, h, fromw, fromh, tow, toh,
            msecs, pad, interruptible, CB)
      return
   }

   if (typeof O(id).ZO_X == UNDEF)
   {
      O(id).ZO_X = X(id)
      O(id).ZO_Y = Y(id)
   }

   if (!O(id).ZO_Flag)
   {
      O(id).ZO_W     = Math.max(fromw, tow)
      O(id).ZO_H     = Math.max(fromh, toh)
      O(id).ZO_Count = 0
   }
   else
   {
      if (!O(id).ZO_Int) return
      else clearInterval(O(id).ZO_IID)

      O(id).ZO_Count = (msecs / INTERVAL) - O(id).ZO_Count
   }

   var maxw  = Math.max(fromw, tow)
   var maxh  = Math.max(fromh, toh)
   var stepw = (tow - fromw) / (msecs / INTERVAL)
   var steph = (toh - fromh) / (msecs / INTERVAL)

   S(id).overflow = HID
   O(id).ZO_Flag  = true
   O(id).ZO_Int   = interruptible
   O(id).ZO_IID   = setInterval(DoZoom, INTERVAL)

   function DoZoom()
   {
      if (w) O(id).ZO_W = Math.round(fromw + stepw * O(id).ZO_Count)
      if (h) O(id).ZO_H = Math.round(fromh + steph * O(id).ZO_Count)

      Resize(id, O(id).ZO_W, O(id).ZO_H)

      var midx = O(id).ZO_X + Math.round((maxw - O(id).ZO_W) / 2)
      var midy = O(id).ZO_Y + Math.round((maxh - O(id).ZO_H) / 2)

      if (pad > 0) ZoomPad(Math.max(fromw, tow),
         Math.max(fromh, toh), O(id).ZO_W, O(id).ZO_H)
      else if (pad != -1) GoTo(id, midx, midy)

      if (O(id).DB_Parent)
         GoToEdge(O(id).DB_Parent, O(id).DB_Where, 50)

      if (++O(id).ZO_Count >= (msecs / INTERVAL))
      {
         var endx      = O(id).ZO_X + Math.round((maxw - tow) / 2)
         var endy      = O(id).ZO_Y + Math.round((maxh - toh) / 2)
         O(id).ZO_Flag = false

         Resize(id, tow, toh)
         clearInterval(O(id).ZO_IID)

         if (pad > 0) ZoomPad(fromw, fromh, tow, toh)
         else if (pad != -1) GoTo(id, endx, endy)

         if (O(id).DB_Parent) GoToEdge(O(id).DB_Parent, O(id).DB_Where, 50)
         if (typeof CB != UNDEF) eval(CB)
      }
      
      function ZoomPad(frw, frh, padw, padh)
      {
         var left   = Math.max(0, frw - Math.round(padw)) / 2
         var right  = left
         var top    = Math.max(0, frh - Math.round(padh)) / 2
         var bottom = top

         if (left != Math.floor(left))
         {
            left  = Math.floor(left)
            right = left + 1
         }

         if (top != Math.floor(top))
         {
            top    = Math.floor(top)
            bottom = top + 1
         }

         S(id).paddingLeft   = Px(left)
         S(id).paddingRight  = Px(right)
         S(id).paddingTop    = Px(top)
         S(id).paddingBottom = Px(bottom)
      }
   }
}

function ZoomDown(id, w, h, msecs, pad, interruptible, CB)
{
   if (id instanceof Array)
   {
      for (var j = 0 ; j < id.length ; ++j)
         ZoomDown(id[j], w, h, msecs, pad, interruptible, CB)
      return
   }

   if (O(id).ZO_Flag && !O(id).ZO_Int) return
   else if (!O(id).ZO_OldW)
   {
      O(id).ZO_OldW = W(id)
      O(id).ZO_OldH = H(id)
      O(id).ZO_X    = X(id)
      O(id).ZO_Y    = Y(id)
   }

   O(id).Zoomdown = true
   GoTo(id, O(id).ZO_X, O(id).ZO_Y)
   Zoom(id, w, h, O(id).ZO_OldW, O(id).ZO_OldH, 0, 0,
      msecs, pad, interruptible, CB)
}

function ZoomRestore(id, w, h, msecs, pad, interruptible, CB)
{
   if (id instanceof Array)
   {
      for (var j = 0 ; j < id.length ; ++j)
         ZoomRestore(id[j], w, h, msecs, pad, interruptible, CB)
      return
   }

   if ((O(id).ZO_Flag && !O(id).ZO_Int) || !O(id).Zoomdown)
       return

   O(id).Zoomdown = false
   Zoom(id, w, h, 0, 0, O(id).ZO_OldW, O(id).ZO_OldH,
      msecs, pad, interruptible, CB)
}

function ZoomToggle(id, w, h, msecs, pad, interruptible, CB)
{
   if (id instanceof Array)
   {
      for (var j = 0 ; j < id.length ; ++j)
         ZoomToggle(id[j], w, h, msecs, pad, interruptible, CB)
      return
   }

   if (O(id).ZO_Flag && !O(id).ZO_Int) return

   if (!O(id).Zoomdown) ZoomDown(id, w, h, msecs, pad, interruptible, CB)
   else              ZoomRestore(id, w, h, msecs, pad, interruptible, CB)
}

function Chain(calls)
{
   for (var j = calls.length ; j >= 0 ; --j)
      if (calls[j])
         CHAIN_CALLS.push(calls[j])

   NextInChain()
}

function NextInChain()
{
   if (CHAIN_CALLS.length)
      CallBack(CHAIN_CALLS.pop())
}

function CallBack(expr)
{
   var insert = expr.lastIndexOf(')')
   var left   = expr.substr(0, insert)
   var right  = expr.substr(insert)
   var middle = "'NextInChain()'"

   if (expr.substr(insert - 1, 1) != '(')
      middle = ', ' + middle
      
   eval(left + middle + right)
}

function ChainThis(expr)
{
   eval(expr)
   NextInChain()
}

function Repeat(number, calls)
{
   var temp = calls

   for (var j = 1 ; j < number ; ++j)
      calls = calls.concat(temp)

   Chain(calls)
}

function While(expr, calls)
{
   if (eval(expr))
   {
      var temp = ''

      for (var j = 0 ; j < calls.length ; ++j)
         temp += '"' + calls[j].replace(/"/g, '\\\"') + '",'

      temp = temp.substr(0, temp.length -1)
      calls.push(InsVars("While('#1', Array(#2))", expr, temp))
      Chain(calls)
   }
}

function Pause(wait)
{
   setTimeout("NextInChain()", wait)
}

function WaitKey()
{
   GetLastKey()
   setTimeout(DoWaitKey, INTERVAL)

   function DoWaitKey()
   {
      if (KEY_PRESS != '') NextInChain()
      else setTimeout(DoWaitKey, INTERVAL)
   }
}

function Flip(id1, id2, w, h, msecs, pad)
{
   if (O(id1).ZO_Flag || O(id2).ZO_Flag) return

   var swap = "ChainThis('VisibilityToggle(\"#1\")')"
   var fast = "ZoomToggle('#1', #2, #3,  1, #4, 0)"
   var slow = "ZoomToggle('#1', #2, #3, #4, #5, 0)"

   Chain(Array(
      InsVars(slow, id1, w, h, msecs / 2, pad),
      InsVars(fast, id2, w, h,            pad),
      InsVars(swap, id2                      ),
      InsVars(slow, id2, w, h, msecs / 2, pad),
      InsVars(swap, id1                      ),
      InsVars(fast, id1, w, h,            pad)
   ))
}

function HoverSlide(id, where, offset, showing, msecs)
{
   var w = GetWindowWidth()  - W(id)
   var h = GetWindowHeight() - H(id)
   var o = offset[0] != '%' ? 0 : offset.substr(1) / 100

   if (where == LT || where == RT)
   {
      var t = W(id) - showing
      var u = Math.min(t, msecs / INTERVAL)
      var x = where == LT ? -t : w + t
      var y = o ? h * o : offset
      var s = t / u
   }
   else
   {
      var t = H(id) - showing
      var u = Math.min(t, msecs / INTERVAL)
      var x = o ? w * o : offset
      var y = where == TP ? -t : h + t
      var s = t / u
   }

   GoTo(id, x, y)
   O(id).HS_X = x
   O(id).HS_Y = y
   O(id).onmouseover = SlideIn
   O(id).onmouseout  = SlideOut

   function SlideIn()
   {
      if (O(id).HS_IID) clearInterval(O(id).HS_IID)
      O(id).HS_IID = setInterval(DoSlideIn, INTERVAL)

      function DoSlideIn()
      {
         var ox = O(id).HS_X
         var oy = O(id).HS_Y

         if      (where == TP && oy < 0) oy = Math.min(0, oy + s)
         else if (where == BM && oy > h) oy = Math.max(h, oy - s)
         else if (where == LT && ox < 0) ox = Math.min(0, ox + s)
         else if (where == RT && ox > w) ox = Math.max(w, ox - s)
         else clearInterval(O(id).HS_IID)

         GoTo(id, ox, oy)
         O(id).HS_X = ox
         O(id).HS_Y = oy
      }
   }

   function SlideOut()
   {
      if (O(id).HS_IID) clearInterval(O(id).HS_IID)
      O(id).HS_IID = setInterval(DoSlideOut, INTERVAL)

      function DoSlideOut()
      {
         var ox = O(id).HS_X
         var oy = O(id).HS_Y

         if      (where == TP && oy > y) oy = Math.max(y, oy - s)
         else if (where == BM && oy < y) oy = Math.min(y, oy + s)
         else if (where == LT && ox > x) ox = Math.max(x, ox - s)
         else if (where == RT && ox < x) ox = Math.max(x, ox + s)
         else clearInterval(O(id).HS_IID)

         GoTo(id, ox, oy)
         O(id).HS_X = ox
         O(id).HS_Y = oy
      }
   }
}

function HoverSlideMenu(ids, where, offset, showing, gap, msecs)
{
   var len   = ids.length
   var total = gap * (len - 1)
   var start = (offset[0] != '%') ? 0 : offset.substr(1) / 100
   var a     = []
   var jump  = 0

   if (where == TP || where == BM)
   {
      for (var j = 0 ; j < len ; ++j)
      {
         a[j]   = W(ids[j])
         total += a[j]
      }
   
      start = start ? (GetWindowWidth() - total) * start : offset * 1
   }
   else
   {
      for (var j = 0 ; j < len ; ++j)
      {
         a[j]   = H(ids[j])
         total += a[j]
      }
   
      start = start ? (GetWindowHeight() - total) * start : offset * 1
   }

   for (var j = 0 ; j < len ; ++j)
   {
      HoverSlide(ids[j], where, start + jump, showing, msecs)
      jump += a[j] + gap
   }
}

function PopDown(id, type, w, h, msecs, interruptible)
{
   if (id instanceof Array)
   {
      for (var j = 0 ; j < id.length ; ++j)
         PopDown(id[j], type, w, h, msecs, interruptible)
      return
   }

   if (type == 'fade')
   {
      FadeOut(id, msecs, interruptible,
         InsVars("Hide('#1')", id))
   }
   else if (type == 'inflate')
   {
      Deflate(id, w, h, msecs, interruptible,
         InsVars("Hide('#1')", id))
   }
   else if (type == 'zoom')
   {
      ZoomDown(id, w, h, msecs, 1, interruptible,
         InsVars("Hide('#1')", id))
   }
   else if (type == 'instant') Hide(id)

   O(id).PO_IsUp = false
}

function PopUp(id, type, w, h, msecs, interruptible)
{
   if (id instanceof Array)
   {
      for (var j = 0 ; j < id.length ; ++j)
         PopUp(id[j], type, w, h, msecs, interruptible)
      return
   }

   Show(id)

   if (type == 'fade')
      FadeIn(id, msecs, interruptible)
   else if (type == 'inflate')
      Reflate(id, w, h, msecs, interruptible)
   else if (type == 'zoom')
      ZoomRestore(id, w, h, msecs, 1, interruptible)

   O(id).PO_IsUp = true
}

function PopToggle(id, type, w, h, msecs, interruptible)
{
   if (id instanceof Array)
   {
      for (var j = 0 ; j < id.length ; ++j)
         PopToggle(id[j], type, w, h, msecs, interruptible)
      return
   }

   if (typeof O(id).PO_IsUp == UNDEF)
      O(id).PO_IsUp = true

   if (O(id).PO_IsUp) PopDown(id, type, w, h, msecs, interruptible)
   else                 PopUp(id, type, w, h, msecs, interruptible)
}

function FoldingMenu(headings, contents, action, type, multi,
   w, h, msecs1, msecs2, interruptible)
{
   PopDown(contents.slice(1), type, w, h, 1, 0)
   O(contents[0]).PO_IsUp = true
   
   for (var j = 0 ; j < headings.length ; ++j)
   {
      O(headings[j]).FO_C   = contents[j]
      S(headings[j]).cursor = 'pointer'

      if (action == 'hover') O(headings[j]).onmouseover = DoFoldingMenu
      else                   O(headings[j]).onclick     = DoFoldingMenu
   }

   function DoFoldingMenu()
   {
      if (multi) PopToggle(this.FO_C, type, w, h, msecs1, interruptible)
      else
      {
         for (j = 0 ; j < headings.length ; ++j)
            if (O(O(headings[j]).FO_C).PO_IsUp && O(headings[j]) != this)
               PopDown(O(headings[j]).FO_C, type, w, h, msecs1, interruptible)

         if (!O(this.FO_C).PO_IsUp)
            PopUp(this.FO_C, type, w, h, msecs2, interruptible)
      }
   }
}

function ContextMenu(id, contents, type, w, h, msecs)
{
   Locate(contents, ABS, -10000, -10000)
   PopDown(contents, type, 1, 1, 1, 0)
   O(id).oncontextmenu = ContextUp

   function ContextUp()
   {
      if (O(contents).PO_IsUp ||
          O(contents).FA_Flag ||
          O(contents).DF_Flag) return false

      var x = MOUSE_X
      var y = MOUSE_Y

      GoTo(contents, x, y)
      PopUp(contents, type, w, h, msecs, 1)

      S(contents).zIndex = ZINDEX + 1
      O(id).Context_IID  = setInterval(ContextDown, INTERVAL)
      return false

      function ContextDown()
      {
         if (MOUSE_X < x || MOUSE_X > (x + W(contents)) ||
             MOUSE_Y < y || MOUSE_Y > (y + H(contents)))
         {
            PopDown(contents, type, w, h, msecs, 1)
            clearInterval(O(id).Context_IID)
            O(contents).PO_IsUp = false
         }
      }
   }
}

function DockBar(id, items, where, increase, msecs)
{
   Position(id, FIX)

   for (var j = 0 ; j < items.length ; ++j)
   {
      if (where == TP || where == BM)
         S(items[j]).verticalAlign = where
      else       O(items[j]).align = where

      var oldw = W(items[j])
      var oldh = H(items[j])

      S(items[j]).cursor    = 'pointer'
      O(items[j]).DB_Parent = id
      O(items[j]).DB_Where  = where
      O(items[j]).DB_OldW   = oldw
      O(items[j]).DB_OldH   = oldh
      O(items[j]).DB_NewW   = Math.round(oldw + oldw * increase / 100)
      O(items[j]).DB_NewH   = Math.round(oldh + oldh * increase / 100)

      O(items[j]).onmouseover = DockUp
      O(items[j]).onmouseout  = DockDown
   }

   GoToEdge(id, where, 50)
   
   function DockUp()
   {
      Zoom(this, 1, 1, O(this).DB_OldW, O(this).DB_OldH,
         O(this).DB_NewW, O(this).DB_NewH, msecs, 0, 1)
   }

   function DockDown()
   {
      Zoom(this, 1, 1, O(this).DB_NewW, O(this).DB_NewH,
         O(this).DB_OldW, O(this).DB_OldH, msecs, 0, 1)
   }
}

function RollOver(ro1, ro2)
{
   if (ro1 instanceof Array)
   {
      for (var j = 0 ; j < id.length ; ++j)
         RollOver(ro1[j], ro2[j])
      return
   }

   var a = Array(ro1, ro2)
   var w = W(ro1) + 1
   var h = H(ro1) + 1
   var x = X(ro1)
   var y = Y(ro1)
   
   Hide(ro2)
   Locate(a, REL, 0, 0)
   O(ro1).onmouseover = DoRoll
   
   function DoRoll()
   {
      HideToggle(a)
      var iid = setInterval(RollCheck, INTERVAL)
      
      function RollCheck()
      {
         if (MOUSE_X < x || MOUSE_X > x + w ||
             MOUSE_Y < y || MOUSE_Y > y + h)
         {
            HideToggle(a)
            clearInterval(iid)
         }
      }
   }
}

function Breadcrumbs(spacer)
{
   var parts  = self.location.href.split('?')[0].split('/')
   var crumbs = Array(parts[0] + '//')

   for (var j = 2 ; j < parts.length ; ++j)
   {
      if (parts[j] == '') crumbs[0] += '/'
      else crumbs.push(parts[j])
   }

   var title   = document.title ? document.title : parts[j - 1]
   var url     = crumbs[0] + crumbs[1]
   var display = InsVars("<a href='#1'>Home</a>", url)
 
   if (typeof spacer == UNDEF) gap = ' '
 
   for (j = 2 ; j < crumbs.length - 1 ; ++j)
   {
      url     += '/' + crumbs[j]
      display += spacer + InsVars("<a href='#1'>#2</a>", url, crumbs[j])
   }

   return display + spacer + title
}

function BrowserWindow(id, headerid, closeid, x, y, bounds,
   type, w, h, msecs, interruptible)
{
   GoTo(id, x, y)
   PopUp(id, type, w, h, msecs, interruptible)

   var browserw = GetWindowWidth()
   var browserh = GetWindowHeight()
   var borderw  = NoPx(S(id).borderLeftWidth) +
                  NoPx(S(id).borderRightWidth)
   var borderh  = NoPx(S(id).borderTopWidth)  +
                  NoPx(S(id).borderBottomWidth)
   var popupw   = W(id)
   var popuph   = H(id)

   S(closeid).cursor       = 'pointer'
   O(id).onclick           = BWToFront
   O(closeid).onclick      = BWCloseWindow
   O(headerid).onmousedown = BWMove

   PreventAction(headerid, 'select', true)
   PreventAction(closeid,  'select', true)

   function BWToFront()
   {
      S(id).zIndex = ++ZINDEX
   }

   function BWCloseWindow()
   {
      PopDown(id, type, w, h, msecs, interruptible)
   }

   function BWMove()
   {
      BWToFront()
      S(headerid).cursor = 'move'

      var xoffset = MOUSE_X - X(id)
      var yoffset = MOUSE_Y - Y(id)
      var iid     = setInterval(DoBWMove, 10)

      function DoBWMove()
      {
         var x = MOUSE_X - xoffset
         var y = MOUSE_Y - yoffset

         if (bounds)
         {
            var r = browserw - popupw - borderw + SCROLL_X
            var b = browserh - popuph - borderh + SCROLL_Y
            x     = Math.max(0, Math.min(x, r))
            y     = Math.max(0, Math.min(y, b))
         }

         if (MOUSE_X < 0 || MOUSE_X > (browserw + SCROLL_X) ||
             MOUSE_Y < 0 || MOUSE_Y > (browserh + SCROLL_Y) ||
             !MOUSE_DOWN || !MOUSE_IN)
         {
            clearInterval(iid)
            S(headerid).cursor = 'default'
         }

         GoTo(id, x, y)
      }
   }
}

function TextScroll(id, dir, number, msecs)
{
    if (id instanceof Array)
   {
      for (var j = 0 ; j < id.length ; ++j)
         TextScroll(id[j], dir, number, msecs)
      return
   }

   if (O(id).TS_Flag) return
   else O(id).TS_Flag = true

   var copy = Html(id)
   var len  = copy.length
   var freq = Math.round(msecs / len)
   var ctr1 = 0
   var ctr2 = 0
   var iid  = setInterval(DoTextScroll, freq)

   function DoTextScroll()
   {
      if (dir == LT) copy = copy.substr(1) + copy[0]
      else           copy = copy[len - 1]  + copy.substr(0, len - 1)

      if (O(id).innerText) O(id).innerText = copy
      else               O(id).textContent = copy

      if (++ctr1 == len)
      {
         ctr1 = 0

         if (++ctr2 == number)
         {
            O(id).TS_Flag = false
            clearInterval(iid)
         }
      }
   }
}

function TextType(id, number, msecs)
{
    if (id instanceof Array)
   {
      for (var j = 0 ; j < id.length ; ++j)
         TextType(id[j], number, msecs)
      return
   }

   if (O(id).TT_Flag) return
   else O(id).TT_Flag = true

   var html = Html(id)
   Html(id, '')
   Show(id)
   var len  = html.length
   var freq = Math.round(msecs / len)
   var ctr1 = 0
   var ctr2 = 0
   var iid  = setInterval(DoTextType, freq)

   function DoTextType()
   {
      var str = html.substr(0, ctr1) + '_'

      if (ctr1++ == len)
      {
         ctr1 = 0
 
         if (++ctr2 == number)
         {
            O(id).TT_Flag = false
            clearInterval(iid)
            str = str.substr(0, len)
         }
      }

      if (O(id).innerText) O(id).innerText  = str
      else Html(id, str)
   }
}

function MatrixToText(id, msecs)
{
    if (id instanceof Array)
   {
      for (var j = 0 ; j < id.length ; ++j)
         MatrixToText(id[j], msecs)
      return
   }

   if (O(id).MT_Flag) return
   else O(id).MT_Flag = true

   var html   = Html(id)
   Html(id, '')
   Show(id)
   var len    = html.length
   var freq   = Math.round(msecs / INTERVAL)
   var matrix = ''
   var count  = 0
   var chars  = 'ABCDEFGHIHJKLMOPQRSTUVWXYZ' +
                'abcdefghijklmnopqrstuvwxyz' +
                '0123456789'

   for (var j = 0 ; j < len ; ++j)
   {
      if (html[j] == '\n' || html[j] == ' ') matrix += html[j]
      else matrix += chars[Math.floor(Math.random() * chars.length)]
   }

   if (O(id).innerText) O(id).innerText   = matrix
   else                 O(id).textContent = matrix

   var iid = setInterval(DoMatrixToText, freq)

   function DoMatrixToText()
   {
      for (j = 0 ; j < len / 20 ; ++j)
      {
         var k  = Math.floor(Math.random() * len)
         matrix = matrix.substr(0, k) + html[k] + matrix.substr(k + 1)
      }

      if (O(id).innerText) O(id).innerText   = matrix
      else                 O(id).textContent = matrix

      if (++count == INTERVAL)
      {
         O(id).MT_Flag = false
         Html(id, html)
         clearInterval(iid)
      }
   }
}

function TextToMatrix(id, msecs)
{
    if (id instanceof Array)
   {
      for (var j = 0 ; j < id.length ; ++j)
         TextToMatrix(id[j], msecs)
      return
   }

   if (O(id).TM_Flag) return
   else O(id).TM_Flag = true

   var text  = Html(id)
   Html(id, '')
   Show(id)
   var len   = text.length
   var freq  = Math.round(msecs / INTERVAL)
   var count = 0
   var chars = 'ABCDEFGHIHJKLMOPQRSTUVWXYZ' +
               'abcdefghijklmnopqrstuvwxyz' +
               '0123456789'
   var iid   = setInterval(DoTextToMatrix, freq)

   function DoTextToMatrix()
   {
      for (var j = 0 ; j < len / 20 ; ++j)
      {
         var k = Math.floor(Math.random() * len)
         var l = Math.floor(Math.random() * chars.length)

         if (text[k] != '\n' && text[k] != '\r' && text[k] != ' ')
            text = text.substr(0, k) + chars[l] + text.substr(k + 1)
      }

      if (O(id).innerText) O(id).innerText   = text
      else                 O(id).textContent = text

      if (++count == INTERVAL)
      {
         O(id).TM_Flag = false
         clearInterval(iid)
      }
   }
}

function ColorFade(id, color1, color2, what, msecs, number, interruptible)
{
    if (id instanceof Array)
   {
      for (var j = 0 ; j < id.length ; ++j)
         ColorFade(id[j], color1, color2, what, msecs, number)
      return
   }

   if (O(id)['CF_Flag' + what])
   {
      if (!O(id)['CF_Int' + what]) return
      else clearInterval(O(id)['CF_IID' + what])
   }
   else O(id)['CF_Flag' + what] = true

   if (color1[0] == '#') color1 = color1.substr(1)
   if (color2[0] == '#') color2 = color2.substr(1)

   var step  = Math.round(msecs / INTERVAL)
   var index = 0
   var count = 0
   var direc = 1
   var cols  = []
   var steps = []

   for (var j = 0 ; j < 3 ; ++j)
   {
      var tmp  = HexDec(color2.substr(j * 2, 2))
      cols[j]  = HexDec(color1.substr(j * 2, 2))
      steps[j] = (tmp - cols[j]) / step
   }

   if (what == 'text') var prop = 'color'
   else var prop = 'background'

   O(id)['CF_Int' + what] = interruptible
   O(id)['CF_IID' + what] = setInterval(DoColorFade, INTERVAL)

   function DoColorFade()
   {
      var temp ='#'

      for (var j = 0 ; j < 3 ; ++j)
         temp += DecHex(ZeroToFF(cols[j] + index * steps[j]))

      S(id)[prop] = temp

      if ((index += direc) > step || index < 0)
      {
         direc = -direc

         if (++count == number)
         {
            O(id)['CF_Flag' + what] = false
            clearInterval(O(id)['CF_IID' + what])
         }
      }

      function ZeroToFF(num)
      {
         return Math.round(Math.min(255, Math.max(0, num)))
      }
   }
}

function FlyIn(id, x, y, msecs)
{
   if (id instanceof Array)
   {
      for (var j = 0 ; j < id.length ; ++j)
         FlyIn(id[j], x, y, msecs)
      return
   }

   if (O(id).FI_Flag) return
   else O(id).FI_Flag = true

   var tox   = X(id)
   var toy   = Y(id)
   var fromx = tox + x
   var fromy = toy + y
   var xstep = x / (msecs / INTERVAL)
   var ystep = y / (msecs / INTERVAL)
   var count = 0

   Position(id, ABS)
   var iid = setInterval(DoFlyIn, INTERVAL)

   function DoFlyIn()
   {
      GoTo(id, fromx - xstep * count, fromy - ystep * count)

      if (count++ >= msecs / INTERVAL)
      {
         O(id).FI_Flag = false
         GoTo(id, tox, toy)
         clearInterval(iid)
      }
   }
}

function TextRipple(id, number, msecs)
{
   if (id instanceof Array)
   {
      for (var j = 0 ; j < id.length ; ++j)
         TextRipple(id[j], number, msecs)
      return
   }

   if (O(id).TR_Flag) return
   else O(id).TR_Flag = true

   var html = Html(id)
   var len  = html.length
   var freq = msecs / len
   var ctr1 = 0
   var ctr2 = 0
   var iid  = setInterval(DoTextRipple, freq)

   function DoTextRipple()
   {
      var temp = html.substr(0, ctr1)

      for (var j = 0 ; j < 7 ; ++j)
         temp += InsVars("<font size='+#1'>#2</font>",
            4 - Math.abs(j - 3), html.substr(ctr1 + j, 1))
 
      Html(id, temp + html.substr(ctr1 + j))

      if (++ctr1 == len)
      {
         ctr1 = 0

         if (++ctr2 == number)
         {
            if (O(id).innerText) O(id).innerText = html
            else               O(id).textContent = html

            O(id).TR_Flag = false
            clearInterval(iid)
         }
      }
   }
}

function Lightbox(id, col1, col2, opacity, msecs)
{
   S(id).cursor = 'pointer'

   if (!O('LB_DIV'))
   {
      var newdiv = document.createElement('div')
      newdiv.setAttribute('id', 'LB_DIV')
      document.body.appendChild(newdiv)
   }

   S(document.body).overflow = HID
   Hide(Array(id, 'LB_DIV'))
   Locate('LB_DIV', ABS, 0, 0)
   Resize('LB_DIV', GetWindowWidth(), GetWindowHeight())
   S('LB_DIV').zIndex = ZINDEX

   Opacity(id, 0)
   Position(id, ABS)
   S(id).zIndex = ++ZINDEX

   Show(Array(id, 'LB_DIV'))
   Center(id)
   Fade('LB_DIV', 0, opacity, msecs)
   FadeIn(id, msecs, 0)
   ColorFade('LB_DIV', col1, col2, 'back', msecs, 1)

   O(id).onclick = DismissLB
   
   function DismissLB()
   {
      Fade('LB_DIV', opacity, 0, msecs)
      ColorFade('LB_DIV', col2, col1, 'back', msecs, 1)
      Chain(Array(
         InsVars("FadeOut(Array('#1', 'LB_DIV'), #2, 0)", id, msecs),
         InsVars("Hide(Array('#1', 'LB_DIV'))", id),
         "S(document.body, 'overflow', 'auto')"
      ))
   }
}

function Slideshow(id, images, msecs, wait)
{
   var len       = images.length
   O(id).SS_Stop = (wait == 'stop') ? true : false

   if (!O(id).SS_Stop && !O(id).SS_Flag)
   {
      if (!O('SS_IMG1'))
      {
         var newimg = document.createElement('img')
         newimg.setAttribute('id', 'SS_IMG1')
         O(id).appendChild(newimg)

         newimg = document.createElement('img')
         newimg.setAttribute('id', 'SS_IMG2')
         O(id).appendChild(newimg)

         Locate('SS_IMG2', ABS, 0, 0)
     }

      var index        = 0
      O('SS_IMG1').src = images[0]
      O(id).SS_Flag    = true
      Opacity('SS_IMG2', 0)
      FadeIn('SS_IMG1', msecs, 0)
      setTimeout(DoSlideshow, msecs + wait)
   }

   function DoSlideshow()
   {
      O('SS_IMG1').src = images[index]
      Opacity('SS_IMG1', 100)
      Opacity('SS_IMG2', 0)

      index = ++index % len
      O('SS_IMG2').src = images[index]

      var next = InsVars("O('SS_IMG1').src = '#1'", 
         images[(index + 1) % len])

      FadeBetween('SS_IMG1', 'SS_IMG2', msecs, 0, next)

      if (!O(id).SS_Stop) setTimeout(DoSlideshow, msecs + wait)
      else O(id).SS_Flag = false
   }
}

function Billboard(id, objects, random, msecs, wait)
{
   var len = objects.length

   if (!O(id).BB_Ready)
   {
      var h          = 0
      O(id).BB_Index = 0

      O(id).BB_Ready = true
      FadeOut(objects.slice(1), 1, 0)

      for (j = 1 ; j < len ; ++j)
      {
         h -= H(O(objects[j-1]))
         Locate(O(objects[j]), REL, 0, h)
      }
   }

   O(id).BB_Stop = (wait == 'stop') ? true : false
   
   if (!O(id).BB_Stop && !O(id).BB_Flag)
      O(id).BB_IID = setTimeout(DoBillboard, msecs + wait)

   function DoBillboard()
   {
      O(id).BB_Flag = true

      if (O(id).BB_Stop)
      {
         O(id).BB_Flag = false
         clearTimeout(O(id).BB_IID)
         return
      }
      else FadeOut(objects[O(id).BB_Index], msecs, 0)

      if (random)
      {
         var rand = O(id).BB_Index 
         while (rand == O(id).BB_Index )
            rand = Math.floor(Math.random() * len)
         O(id).BB_Index = rand
      }
      else O(id).BB_Index = ++O(id).BB_Index  % len

      FadeIn(objects[O(id).BB_Index ], msecs, 0)
      clearTimeout(O(id).BB_IID)
      O(id).BB_IID = setTimeout(DoBillboard, msecs + wait)
   }
}

function GoogleChart(id, title, tcolor, tsize, type, bwidth,
   labels, legends, colors, bgfill, width, height, data)
{
   var types =
   {
      'line'    : 'lc',
      'vbar'    : 'bvg',
      'hbar'    : 'bhg',
      'gometer' : 'gom',
      'pie'     : 'p',
      'pie3d'   : 'p3',
      'venn'    : 'v',
      'radar'   : 'r'
   }

   if (typeof type == UNDEF) type = 'pie'

   var t1                     = escape(title)
   var t2                     = types[type]
   var tail                   = 'chtt='          + t1
                              + '&amp;cht='      + t2
                              + '&amp;chs='      + width  + 'x' + height
                              + '&amp;chbh='     + bwidth
                              + '&amp;chxt=x,y'
                              + '&amp;chd=t:'    + data

   if (tcolor && tsize) tail += '&amp;chts='     + tcolor + ',' + tsize
   if (labels)          tail += '&amp;chl='      + labels
   if (legends)         tail += '&amp;chdl='     + legends
   if (colors)          tail += '&amp;chco='     + colors
   if (bgfill)          tail += '&amp;chf=bg,s,' + bgfill

   Html(id, "<img src='http://chart.apis.google.com/chart?" +
      tail + "' />")
}

function PlaySound(id, file, loop)
{
   Resize(id, 0, 0)
   Locate(id, ABS, 0, 0)

   if (loop == 'stop') Html(id, '')
   else Html(id, InsVars("<embed src='#1' hidden='true' " +
      "autostart='true' loop='#2' />", file, loop))
}

function EmbedYouTube(video, width, height, hq, full, auto)
{
   if (hq) hq = '&amp;ap=%2526fmt%3D18'
   else    hq = ''

   if (width && !height) height = width  * 0.7500
   if (!width && height) width  = height * 1.3333
   if (!width)           width  = 425
   if (!height)          height = 324
   
   var temp = InsVars("<object width='#1' height='#2'>"      +
      "<param name='movie' value='http://www.youtube.com/v/" +
      "#3&amp;fs=1&amp;autoplay=#4#5'>", width, height, video,
      auto, hq)

   temp += InsVars("</param><param name='allowFullScreen' "  +
      "value='#1'></param><param name='allowscriptaccess' "  +
      "value='always'></param>", full)

   temp += InsVars("<embed src='http://www.youtube.com"      +
      "/v/#1&amp;fs=1&amp;autoplay=#2#3' type='application/" +
      "x-shockwave-flash' allowscriptaccess='always' "       +
      "allowfullscreen='true'", video, auto, hq)
      
   temp += InsVars("width='#1' height='#2'></embed></object>",
      width, height)

   return temp
}

function PulsateOnMouseover(id, op1, op2, msecs)
{
   if (id instanceof Array)
   {
      for (var j = 0 ; j < id.length ; ++j)
         PulsateOnMouseover(id[j], op1, op2, msecs)
      return
   }

   var finish = false
   var iid

   Opacity(id, op1)
   O(id).FA_Level    = op1
   O(id).onmouseover = PulsateOn
   O(id).onmouseout  = function() { finish = true }

   function PulsateOn()
   {
      var faded = false
      finish    = false

      if (iid) clearInterval(iid)
      iid = setInterval(DoPulsate, INTERVAL)

      function DoPulsate()
      {
         if (!faded && O(id).FA_Level == op1)
         {
            if (finish) clearInterval(iid)
            else
            {
               Fade(id, op1, op2, msecs / 2, 0)
               faded = true
            }
         }
         else if (!O(id).FA_Flag)
         {
            Fade(id, op2, op1, msecs / 2, 0)
            faded = false
         }
      }
   }
}

function ProcessCookie(action, name, value, seconds, path, domain, secure)
{
   if (action == 'save')
   {
      var date = new Date()
      date.setTime(parseInt(date.getTime() + seconds * 1000))

      var expires     = seconds ? '; expires=' + date.toGMTString() : ''
      path            = path    ? '; path='    + path               : ''
      domain          = domain  ? '; domain='  + domain             : ''
      secure          = secure  ? '; secure='  + secure             : ''
      document.cookie = name + '=' + escape(value) + expires + path
   }
   else if (action == 'read')
   {
      if (!document.cookie.length) return false
      else
      {
         var start = document.cookie.indexOf(name + '=')

         if (start == -1) return false
         else
         {
            start  += name.length + 1
            var end = document.cookie.indexOf(';', start)
            end     = (end == -1) ? document.cookie.length : end
            
            return unescape(document.cookie.substring(start, end))
         }
      }
   }
   else if (action == 'erase')
      ProcessCookie('save', name, '', -60)
}

function CreateAjaxObject(callback, force)
{
   try
   {
      var ajax = new XMLHttpRequest()
   }
   catch(e1)
   {
      try
      {
         ajax = new ActiveXObject("Msxml2.XMLHTTP")
      }
      catch(e2)
      {
         try
         {
            ajax = new ActiveXObject("Microsoft.XMLHTTP")
         }
         catch(e3)
         {
            ajax = false
         }
      }
   }

   if (ajax) ajax.onreadystatechange = function()
   {
      if (this.readyState == 4   &&
          this.status     == 200 &&
          this.responseText != null)
      callback.call(this.responseText)
   }

   return ajax
}

function GetAjaxRequest(callback, url, args)
{
   var nocache = '&nocache=' + Math.random() * 1000000
   var ajax    = new CreateAjaxObject(callback)
   if (!ajax) return false

   ajax.open('GET', url + '?' + args + nocache, true)
   ajax.send(null)
   return true
}

function PostAjaxRequest(callback, url, args)
{
   var contenttype = 'application/x-www-form-urlencoded'
   var ajax        = new CreateAjaxObject(callback)
   if (!ajax) return false

   ajax.open('POST', url, true)
   ajax.setRequestHeader('Content-type',   contenttype)
   ajax.setRequestHeader('Content-length', args.length)
   ajax.setRequestHeader('Connection',     'close')
   ajax.send(args)
   return true
}

function FrameBust(message)
{
   if (top != self)
   {
      if (message)
      {
         if (confirm(message))
            top.location.replace(self.location.href)
      }
      else top.location.replace(self.location.href)
   }
}

function ProtectEmail()
{
   var a = ''

   for (var j=0 ; j < arguments.length ; ++j)
      a += arguments[j]

   return "<a hr" + "ef" + "='mai" + "lt" + "o:" + a + "'>" + a + "</a>"
}

function FieldPrompt(id, prompt, inputcolor, promptcolor, promptstyle)
{
   inputcolor  = inputcolor  ? inputcolor  : '#000000'
   promptcolor = promptcolor ? promptcolor : '#888888'
   promptstyle = promptstyle ? promptstyle : 'italic'

   if (BROWSER == 'Opera' || BROWSER == 'Chrome') ResizeWidth(id, W(id))

   FP_On()

   O(id).onfocus = FP_Off
   O(id).onblur  = FP_On

   function FP_Off()
   {
      if (O(id).value == prompt)
      {
         O(id).FP_Empty  = true
         O(id).value     = ''
         S(id).fontStyle = ''
         S(id).color     = inputcolor
      }
      else O(id).FP_Empty = false
   }

   function FP_On()
   {
      if (O(id).value == '' || O(id).value == prompt)
      {
         O(id).FP_Empty  = true
         O(id).value     = prompt
         S(id).fontStyle = promptstyle
         S(id).color     = promptcolor
      }
      else O(id).FP_Empty = false
   }
}

function ResizeTextarea(id, min, max)
{
   if (id instanceof Array)
   {
      for (var j = 0 ; j < id.length ; ++j)
         ResizeTextarea(id[j], min, max)
      return
   }

   min = min ? min : 0
   max = max ? max : 10

   O(id).onmouseup = DoResizeTextarea
   O(id).onkeyup   = DoResizeTextarea

   function DoResizeTextarea()
   {
      while (O(id).scrollHeight > O(id).clientHeight && O(id).rows < max)
         ++O(id).rows

      while (O(id).scrollHeight < O(id).clientHeight && O(id).rows > min)
         --O(id).rows
   }
}

function ValidateEmail(email)
{
   var at = email.indexOf('@')

   if (at == -1 || /[^\w\-\.\@\_\+]/.test(email)) return false

   var left  = email.substr(0, at)
   var right = email.substr(at + 1)
   var llen  = left.length
   var rlen  = right.length

   if (llen < 1 || llen > 64 || rlen < 4 || rlen > 254 ||
      right.indexOf('.') == -1) return false

   return true
}

function ValidatePassword(pass, min, max, upper, lower, dig, punct)
{
   var len   = pass.length
   var valid = true
   
   if      (len < min || len > max)               valid = false
   else if (upper  && !/[A-Z]/.test(pass))        valid = false
   else if (lower  && !/[a-z]/.test(pass))        valid = false
   else if (dig    && !/[0-9]/.test(pass))        valid = false
   else if (punct  && !/[^a-zA-Z0-9]/.test(pass)) valid = false

   return valid
}

function CleanupString(string, allspaces, alldigs, alltext, allpunct,
   uptolow, lowtoup, spacestosingle)
{
   if (allspaces)      string = string.replace(/[\s]/g, '')
   if (alldigs)        string = string.replace(/[\d]/g, '')
   if (alltext)        string = string.replace(/[a-zA-Z]/g, '')
   if (allpunct)       string = string.replace(/[^\sa-zA-Z0-9]/g, '')
   if (uptolow)        string = string.toLowerCase()
   if (lowtoup)        string = string.toUpperCase()
   if (spacestosingle) string = string.replace(/[\s]+/g, ' ')

   return string
}

function ValidateCreditCard(number, month, year)
{
   number     += ''
   month      += ''
   year       += ''
   number      = CleanupString(number, true, false, true, true)
   month       = CleanupString(month,  true, false, true, true)
   year        = CleanupString(year,   true, false, true, true)
   var left    = number.substr(0, 4)
   var cclen   = number.length
   var chksum  = 0
   
   if (left >= 3000 && left <= 3059 ||
       left >= 3600 && left <= 3699 ||
       left >= 3800 && left <= 3889)
   { // Diners Club
      if (cclen != 14) return false
   }
   else if (left >= 3088 && left <= 3094 ||
       left >= 3096 && left <= 3102 ||
       left >= 3112 && left <= 3120 ||
       left >= 3158 && left <= 3159 ||
       left >= 3337 && left <= 3349 ||
       left >= 3528 && left <= 3589)
   { // JCB
      if (cclen != 16) return false
   }
   else if (left >= 3400 && left <= 3499 ||
       left >= 3700 && left <= 3799)
   { // American Express
      if (cclen != 15) return false
   }
   else if (left >= 3890 && left <= 3899)
   { // Carte Blanche
      if (cclen != 14) return false
   }
   else if (left >= 4000 && left <= 4999)
   { // Visa
      if (cclen != 13 && cclen != 16) return false
   }
   else if (left >= 5100 && left <= 5599)
   { // MasterCard
      if (cclen != 16) return false
   }
   else if (left == 5610)
   { // Australian BankCard
      if (cclen != 16) return false
   }
   else if (left == 6011)
   { // Discover
      if (cclen != 16) return false
   }
   else return false // Unrecognized Card

   for (var j = 1 - (cclen % 2) ; j < cclen ; j += 2)
      if (j < cclen) chksum += number[j] * 1

   for (j = cclen % 2 ; j < cclen ; j += 2)
   {
      if (j < cclen)
      {
         d = number[j] * 2
         chksum += d < 10 ? d : d - 9
      }
   }

   if (chksum % 10 != 0) return false

   var date = new Date()
   date.setTime(date.getTime())

   if (year.length == 4) year = year.substr(2, 2)

   if (year > 50)                               return false
   else if (year < (date.getFullYear() - 2000)) return false
   else if ((date.getMonth() + 1 ) > month)     return false
   else                                         return true
}

function RollingCopyright(start)
{
   var date = new Date()
   date     = date.getFullYear()

   return '&copy; ' + start + "-" + date
}

function Alert(value)
{
   var divs = Array('ALERT_DIV', 'SHADOW_DIV')
   var warn = "<font color=red size=6 style='vertical-align:middle;'>" +
              "&#916;</font>&nbsp;"
   var ok   = "<center><input id='ALERT_OK' type='submit' /></center>"
   var mess = warn + value + '<br /><br />' + ok
   var html = "<div id='ALERT_TITLE'></div>" +
              "<div id='ALERT_MESSAGE'></div>"

   if (!O('ALERT_DIV'))
   {
      var newdiv = document.createElement('div')
      newdiv.setAttribute('id', 'SHADOW_DIV')
      document.body.appendChild(newdiv)
      newdiv = document.createElement('div')
      newdiv.setAttribute('id', 'ALERT_DIV')
      document.body.appendChild(newdiv)
      Position(divs, ABS)
      Resize('ALERT_DIV',  350, 140)
      Resize('SHADOW_DIV', 354, 146)
      Center('ALERT_DIV')
      GoTo('SHADOW_DIV', X('ALERT_DIV') + 4, Y('ALERT_DIV') + 6)
      Opacity('SHADOW_DIV', 50)
   }

   AlertHide()
   Html('ALERT_DIV', html)
   Resize('ALERT_TITLE',   350, 22)
   Resize('ALERT_MESSAGE', 330, 98)
   Html('ALERT_TITLE', 'Message from the webpage')
   Html('ALERT_MESSAGE', mess)

   S('ALERT_TITLE').background   = '#acc5e0'
   S('ALERT_TITLE').fontFamily   = 'Arial'
   S('ALERT_TITLE').paddingTop   = '2px'
   S('ALERT_TITLE').textAlign    = 'center'
   S('ALERT_TITLE').fontSize     = '14px'
   S('ALERT_MESSAGE').fontFamily = 'Arial'
   S('ALERT_MESSAGE').fontSize   = '12px'
   S('ALERT_MESSAGE').padding    = '10px'
   S('ALERT_MESSAGE').overflow   = 'auto'
   S('ALERT_DIV').background     = '#f0f0f0'
   S('ALERT_DIV').border         = 'solid #444444 1px'
   S('SHADOW_DIV').background    = '#444444'
   O('ALERT_OK').value           = '      OK      '

   O('ALERT_OK').onclick = AlertHide
   Visible(divs)

   function AlertHide()
   {
      Invisible(divs)
   }
}

function ReplaceAlert()
{
   window.alert = Alert
}

function ToolTip(id, tip, font, size, textc, backc, bordc,
   bstyle, bwidth, msecs, timeout)
{
   var tt = 'TT_' + O(id).id

   if (!O(tt))
   {
      var newdiv = document.createElement('div')
      newdiv.setAttribute('id', tt)
      document.body.appendChild(newdiv)
      Opacity(tt, 0)
      Position(tt, ABS)

      font   = font   ? font   : 'Arial'
      size   = size   ? size   : 'small'
      textc  = textc  ? textc  : '#884444'
      backc  = backc  ? backc  : '#ffff88'
      bordc  = bordc  ? bordc  : '#aaaaaa'
      bstyle = bstyle ? bstyle : 'dotted'
      bwidth = bwidth ? bwidth : 1
      msecs  = msecs  ? msecs  : 250

      S(tt).fontFamily  = font
      S(tt).fontSize    = size
      S(tt).padding     = '3px 5px 3px 5px'
      S(tt).color       = textc
      S(tt).background  = backc
      S(tt).borderColor = bordc
      S(tt).borderStyle = bstyle
      S(tt).borderWidth = Px(bwidth)

      Html(tt, tip)
   }

   O(id).onmouseover = DoToolTip
   O(id).onmouseout  = ToolTipHide
   O(tt).Hidden      = false

   function DoToolTip()
   {
      GoTo(tt, MOUSE_X + 15, MOUSE_Y + 15)
      O(tt).zIndex = ZINDEX + 1
      FadeIn(tt, msecs)
      O(tt).Hidden = false

      if (timeout)
      {
         if (O(tt).IID) clearTimeout(O(tt).IID)
         O(tt).IID = setTimeout(ToolTipHide, timeout)
      }
   }

   function ToolTipHide()
   {
      if (!O(tt).Hidden)
      {
         FadeOut(tt, msecs)
         O(tt).Hidden = true
      }
   }
}

function CursorTrail(image, length, state)
{
   var w = GetWindowWidth()
   var h = GetWindowHeight()
   var c = 'CT_'

   if (!state) return clearInterval(CT_IID)

   if (!O('TT_0'))
   {
      for (var j = 0 ; j < 10 ; ++j)
      {
         var newimg = document.createElement('img')
         newimg.setAttribute('id', c + j)
         document.body.appendChild(newimg)
         Position(newimg, ABS)
         Opacity(newimg, (j + 1) * 9)
         newimg.src = image
         O(c + j).X = -9999
         O(c + j).Y = -9999
      }
   }

   CT_IID = setInterval(DoCurTrail, length)

   function DoCurTrail()
   {
      for (var j = 0 ; j < 10 ; ++j)
      {
         GoTo(c + j, O(c + j).X + 2, O(c + j).Y + 2)
         S(c + j).zIndex = ZINDEX + 1

         if (O(c + j).X == MOUSE_X && O(c + j).Y == MOUSE_Y) Hide(c + j)
         else Show(c + j)

         if (j > 0)
         {
            O(c + (j - 1)).X = O(c + j).X
            O(c + (j - 1)).Y = O(c + j).Y
         }
      }

      O(c + 9).X = MOUSE_X < (w - 12) ? MOUSE_X : -9999
      O(c + 9).Y = MOUSE_Y < (h - 20) ? MOUSE_Y : -9999
   }
}

function TouchEnable(state)
{
   var db = document.body

   if (state)
   {
      var iid  = null
      var flag = false

      PreventAction(db, 'both', true)

      db.onmousedown = StartTE
      db.onmouseup   = StopTE
   }
   else
   {
      PreventAction(db, 'both', false)

      db.onmousedown = ''
      db.onmouseup   = ''

      return
   }

   function StartTE(e)
   {
      if (!flag)
      {
         var oldmousex  = MOUSE_X
         var oldmousey  = MOUSE_Y
         var tempmousex = MOUSE_X
         var tempmousey = MOUSE_Y

         flag = true
         iid  = setInterval(DoTE, 10)
      }
      
      return false

      function DoTE()
      {
         if (MOUSE_DOWN && MOUSE_IN)
         {
            if (MOUSE_X != tempmousex || MOUSE_Y != tempmousey)
            {
               tempmousex = MOUSE_X
               tempmousey = MOUSE_Y
               window.scrollBy(oldmousex - MOUSE_X, oldmousey - MOUSE_Y)
            }
         }
         else StopTE()
      }
   }

   function StopTE()
   {
      flag = false
      clearInterval(iid)
   }
}

// Based on a function by Ryan Morr at:
// http://ryanmorr.com/archives/ondomready-no-browser-sniffing
//
// Use this in place of window.onload to start your code much more
// quickly than waiting for window.onload, which only triggers after
// all contents such as images are also loaded - whereas this code
// triggers as soon as the DOM is complete and in a useable state.
//
// Example:
//
//    OnDOMReady(function()
//    {
//       // Your code goes here...
//    })

function OnDOMReady(func)
{
   var timer = setInterval(onChange, 5)
   var ready = false

   if(document.addEventListener) document.addEventListener(
      "DOMContentLoaded", onChange, false)

   document.onreadystatechange = window.onload = onChange

   function onChange(e)
   {
      if(e && e.type == "DOMContentLoaded")
      {
         fireDOMReady()
      }
      else if(e && e.type == "load")
      {
         fireDOMReady()
      }
      else if(document.readyState)
      {
         if((/loaded|complete/).test(document.readyState))
         {
            fireDOMReady()
         }
         else if(!!document.documentElement.doScroll)
         {
            try
            {
               ready || document.documentElement.doScroll('left')
            }
            catch(e)
            {
               return
            }

            fireDOMReady();
         }
      }
   }

   function fireDOMReady()
   {
      if(!ready)
      {
         ready = true
         func.call()

         if(document.removeEventListener) document.removeEventListener(
            "DOMContentLoaded", onChange, false)

         clearInterval(timer)
         document.onreadystatechange = window.onload = timer = null
      }
   }
}
