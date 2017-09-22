/************************************/
/*        PC.js: Version 1.0        */
/* From Plug-in CSS, by Robin Nixon */
/*         McGraw-Hill 2011         */
/*                                  */
/* Plug-ins 58-100: Dynamic classes */
/*         and Superclasses         */
/************************************/

Initialize()

OnDOMReady(function()
{
   var gfurl    = 'http://fonts.googleapis.com/css?family='
   var wheight  = GetWindowHeight()
   var tags     = document.getElementsByTagName("*")
   var numtags  = tags.length
   var font     = ''
   var elems    = []
   var gfonts   = []
   var cites    = []
   var refers   = []
   var sclasses = []
   var gfindex  = 0
   var cindex   = 0
   var demand   = false
   var index, index2, thistag, regex, oldclassname

   loadsclasses(sclasses)

   for (index = 0 ; index < numtags ; ++ index)
   {
      thistag       = tags[index]
      var tagname   = thistag.tagName.toLowerCase()
      var tagtype   = (thistag.type) ? thistag.type.toLowerCase() : ''
      var classname = thistag.className.toLowerCase()
      var cnamecopy = classname
      var origcname = thistag.className
      var repeat    = true

      /**********************/
      /* Chapter 8: Objects */
      /**********************/

      /* 58: nojs and onlyjs classes */

      if (classname.search(/\bnojs\b/, 0)   != -1) Hide(thistag)

      if (classname.search(/\bonlyjs\b/, 0) != -1) Show(thistag)

      /* 59: middle class */

      if (classname.search(/\bmiddle\b/, 0) != -1)
      {
         S(thistag).marginTop = S(thistag).marginBottom =
            Px((H(thistag.parentNode) - H(thistag)) / 2)
      }
 
      /* 60: center class */

      if (classname.search(/\bcenter\b/, 0) != -1)
      {
         S(thistag).marginLeft = S(thistag).marginRight =
            Px((W(thistag.parentNode) - W(thistag)) / 2)
      }

      /* 61: top class */

      if (classname.search(/\btop\b/, 0) != -1)
      {
         S(thistag).marginTop    = '0px';
         S(thistag).marginBottom = Px(H(thistag.parentNode) -H(thistag))
      }

      /* 62: bottom class */

      if (classname.search(/\bbottom\b/, 0) != -1)
      {
         S(thistag).marginTop    = Px(H(thistag.parentNode) -H(thistag))
         S(thistag).marginBottom = '0px';
      }

      /* 63: left class */

      if (classname.search(/\bleft\b/, 0) != -1)
      {
         S(thistag).marginLeft  = '0px';
         S(thistag).marginRight = Px(W(thistag.parentNode) - W(thistag))
      }

      /* 64: right class */

      if (classname.search(/\bright\b/, 0) != -1)
      {
         S(thistag).marginLeft  = Px(W(thistag.parentNode) - W(thistag))
         S(thistag).marginRight = '0px';
      }

      /* 65: ondemand class */

      if (classname.search(/\bondemand\b/, 0) != -1 && tagname == 'img')
      {
         if (Y(thistag) > (SCROLL_Y + wheight))
         {
            elems[index] = thistag.alt
            demand       = true
            Opacity(thistag, 0)
         }
         else thistag.src = thistag.alt
      }

      /* 66: fadein class */

      if (classname.search(/\bfadein\b/, 0) != -1)
      {
         cnamecopy.replace(/fadein\[([^\]]*)\]/, function()
         {
            Opacity(thistag, 0);
            FadeIn(thistag, arguments[1])
         } )
      }

      /* 67: fadeout class */

      if (classname.search(/\bfadeout\b/, 0) != -1)
      {
         cnamecopy.replace(/fadeout\[([^\]]*)\]/, function()
         {
            FadeOut(thistag, arguments[1])
         } )
      }

      /* 68: resizeta class */

      if (classname.search(/\bresizeta\b/, 0) != -1 &&
         tagname == 'textarea')
      {
         cnamecopy.replace(/resizeta\[([^\|]*)\|([^\]]*)\]/, function()
         {
            ResizeTextarea(thistag, arguments[1], arguments[2])
         } )
      }

      /* 69: rotate class */

      if (classname.search(/\brotate\b/, 0) != -1)
      {
         cnamecopy.replace(/rotate\[([^\]]*)\]/, function()
         {
            var r = arguments[1]

            S(thistag).MozTransform    = 'rotate(' + r + 'deg)'
            S(thistag).WebkitTransform = 'rotate(' + r + 'deg)'
            S(thistag).OTransform      = 'rotate(' + r + 'deg)'
            S(thistag).transform       = 'rotate(' + r + 'deg)'

            if (typeof S(thistag).filter != UNDEF)
            {
               var rad    = r * (Math.PI * 2 / 360)
               var cosrad = Math.cos(rad)
               var sinrad = Math.sin(rad)
               var w      = W(thistag)
               var h      = H(thistag)
               var filter = 'progid:DXImageTransform.Microsoft.' +
                  'Matrix(M11=' + cosrad + ', M12=' + -sinrad    +
                  ',      M21=' + sinrad + ', M22=' +  cosrad    +
                  ", SizingMethod='auto expand')"

               S(thistag).filter = filter
               Locate(thistag, REL, -((W(thistag) - w) / 2),
                                    -((H(thistag) - h) / 2))
            }
         } )
      }

      /* 70: w class */

      if (classname.search(/\bw\b/, 0) != -1)
      {
         cnamecopy.replace(/w\[([^\]]*)\]/, function()
         {
            S(thistag).width = Px(arguments[1])
         } )
      }

      /* 71: h class */

      if (classname.search(/\bh\b/, 0) != -1)
      {
         cnamecopy.replace(/h\[([^\]]*)\]/, function()
         {
            S(thistag).height = Px(arguments[1])
         } )
      }

      /* 72: x class */

      if (classname.search(/\bx\b/, 0) != -1)
      {
         cnamecopy.replace(/x\[([^\]]*)\]/, function()
         {
            S(thistag).left = Px(arguments[1])
         } )
      }

      /* 73: y class */

      if (classname.search(/\by\b/, 0) != -1)
      {
         cnamecopy.replace(/y\[([^\]]*)\]/, function()
         {
            S(thistag).top = Px(arguments[1])
         } )
      }

      /* 74: color class */

      if (classname.search(/\bcolor\b/, 0) != -1)
      {
         cnamecopy.replace(/color\[([^\]]*)\]/, function()
         {
            S(thistag).color = arguments[1]
         } )
      }

      /* 75: bcolor class */

      if (classname.search(/\bbcolor\b/, 0) != -1)
      {
         cnamecopy.replace(/bcolor\[([^\]]*)\]/, function()
         {
            S(thistag).backgroundColor = arguments[1]
         } )
      }

      /**********************************/
      /* Chapter 9: Text and Typography */
      /**********************************/

      /* 76: typetext class */

      if (classname.search(/\btypetext\b/, 0) != -1)
      {
         cnamecopy.replace(/typetext\[([^\]]*)\]/, function()
         {
            TextType(thistag, 1, arguments[1])
         } )
      }

      /* 77: digitsonly class */

      if (classname.search(/\bdigitsonly\b/, 0) != -1)
      {
         thistag.onchange = thistag.onmouseout =
            thistag.onsubmit = function()
         {
            this.value = CleanupString(this.value, 0, 0, 1, 1)
         }
      }

      /* 78: textonly class */

      if (classname.search(/\btextonly\b/, 0) != -1)
      {
         thistag.onchange = thistag.onmouseout =
            thistag.onsubmit = function()
         {
            this.value = CleanupString(this.value, 0, 1, 0, 1)
         }
      }

      /* 79: nospaces class */

      if (classname.search(/\bnospaces\b/, 0) != -1)
      {
         thistag.onchange = thistag.onmouseout =
            thistag.onsubmit = function()
         {
            this.value = CleanupString(this.value, 1)
         }
      }

      /* 80: nopunct class */

      if (classname.search(/\bnopunct\b/, 0) != -1)
      {
         thistag.onchange = thistag.onmouseout =
            thistag.onsubmit = function()
         {
            this.value = CleanupString(this.value, 0, 0, 0, 1)
         }
      }

      /* 81: minwhitespace class */

      if (classname.search(/\bminwhitespace\b/, 0) != -1)
      {
         thistag.onchange = thistag.onmouseout =
            thistag.onsubmit = function()
         {
            this.value = CleanupString(this.value, 0, 0, 0, 0, 0, 0, 1)
         }
      }

      /* 82: gfont class */

      if (classname.search(/\bgfont\b/, 0) != -1)
      {
         cnamecopy.replace(/gfont\[([^\]]*)\]/, function()
         {
            switch(arguments[1])
            {
               case 'cantarell'  : font = 'Cantarell'; break
               case 'cardo'      : font = 'Cardo'; break
               case 'crimson'    : font = 'Crimson Text'; break
               case 'droidsans'  : font = 'Droid Sans'; break
               case 'droidsansm' : font = 'Droid Sans Mono'; break
               case 'droidserif' : font = 'Droid Serif'; break
               case 'imfell'     : font = 'IM Fell English'; break
               case 'inconsolata': font = 'Inconsolata'; break
               case 'josefin'    : font = 'Josefin Sans Std Light'; break
               case 'lobster'    : font = 'Lobster'; break
               case 'molengo'    : font = 'Molengo'; break
               case 'neuton'     : font = 'Neuton'; break
               case 'nobile'     : font = 'Nobile'; break
               case 'oflsorts'   : font = 'OFL Sorts Mill Goudy TT';break
               case 'oldstandard': font = 'Old Standard TT'; break
               case 'reenie'     : font = 'Reenie Beanie'; break
               case 'tangerine'  : font = 'Tangerine'; break
               case 'vollkorn'   : font = 'Vollkorn'; break
               case 'yanone'     : font = 'Yanone Kaffeesatz'; break
            }

            if (!window[font])
            {
               window[font]      = true
               gfonts[gfindex++] = font
            }

            S(thistag).fontFamily = font
         } )
      }

      /* 83: textmiddle class */

      if (classname.search(/\btextmiddle\b/, 0) != -1)
      {
         S(thistag).lineHeight = Px(H(thistag))
      }

      /* 84: textglow class */

      if (classname.search(/\btextglow\b/, 0) != -1)
      {
         cnamecopy.replace(/textglow\[([^\|]*)\|([^\|]*)\|([^\]]*)\]/,
            function()
         {
            ColorFade(thistag, arguments[1], arguments[2], 'text',
               arguments[3])
         } )
      }

      /* 85: backglow class */

      if (classname.search(/\bbackglow\b/, 0) != -1)
      {
         cnamecopy.replace(/backglow\[([^\|]*)\|([^\|]*)\|([^\]]*)\]/,
            function()
         {
            ColorFade(thistag, arguments[1], arguments[2], '',
               arguments[3])
         } )
      }

      /**************************/
      /* Chapter 10: Navigation */
      /**************************/

      /* 86: placeholder class */

      if (classname.search(/\bplaceholder\b/, 0) != -1 &&
         tagname == 'input')
      {
         origcname.replace(/placeholder\[([^\]]*)\]/, function()
         {
            if (thistag.placeholder == '' ||
               typeof thistag.placeholder == UNDEF)
               FieldPrompt(thistag, arguments[1])
         } )
      }

      /* 87: autofocus class */
      
      if (classname.search(/\bautofocus\b/, 0) != -1 &&
         tagname == 'input'    || tagname == 'select' ||
         tagname == 'textarea' || tagname == 'button')
      {
         if (tagtype != 'hidden') thistag.focus()
      }

      /* 88: cite class */

      if (classname.search(/\bcite\b/, 0) != -1)
      {
         origcname.replace(/cite\[([^\]]*)\]/, function()
         {
            cites[cindex++]           = arguments[1]
            S(thistag).verticalAlign  = 'super'
            S(thistag).textDecoration = 'none'
            S(thistag).fontSize       = '50%'

            Html(thistag, Html(thistag) +
               InsVars("<a href='#cite#1'>[#1]</a>", cindex))
         } )
      }

      /* 89: ref class */

      if (classname.search(/\bref\b/, 0) != -1)
      {
         cnamecopy.replace(/ref\[([^\|]*)\|([^\]]*)\]/, function()
         {
            var a1 = arguments[1]
            var a2 = arguments[2]

            if (typeof refers[a1] == UNDEF)
            {
               refers[a1]          = Array()
               refers[a1]['count'] = 1
               refers[a1][a2]      = 1
            }
            else if (typeof refers[a1][a2] == UNDEF)
               refers[a1][a2] = ++refers[a1]['count']

            Html(thistag, refers[a1][a2])
         } )
      }

      /* 90: nocopy class */

      if (classname.search(/\bnocopy\b/, 0) != -1)
      {
         PreventAction(thistag, 'both', true)
      }

      /****************************************/
      /* Chapter 11: Incorporating JavaScript */
      /****************************************/

      /* 91: embedjs class */

      if (classname.search(/\bembedjs\b/, 0) != -1)
      {
         Html(thistag, Html(thistag).replace(/\[\[([^\]]*)\]\]/g,
            function()
         {
            arguments[1] = arguments[1].replace(/&lt;/g, '<')
            arguments[1] = arguments[1].replace(/&gt;/g, '>')

            try
            {
               return eval(arguments[1])
            }
            catch(e)
            {
               return "<span class='red'>[" + e + "]</span>"
            }
         } ))
      }

      /* 92: if class */

      if (classname.search(/\bif\b/, 0) != -1)
      {
         origcname.replace(/(if|IF)\[([^\]]*)\]/, function()
         {
            if (!eval(arguments[2]))
               Html(thistag, '<!-- ' + Html(thistag) + ' -->')
         } )
      }

      /* 93: ifnot class */

      if (classname.search(/\bifnot\b/, 0) != -1)
      {
         origcname.replace(/(ifnot|IFNOT)\[([^\]]*)\]/, function()
         {
            if (eval(arguments[2]))
               Html(thistag, '<!-- ' + Html(thistag) + ' -->')
         } )
      }

      /****************************/
      /* Chapter 12: Superclasses */
      /****************************/

      // Load in superclasses from meta tags
      if (thistag.tagName == 'META' &&
         thistag.httpEquiv.toUpperCase() == 'SCLASS')
            sclasses[thistag.name] = thistag.content

      // Apply superclasses
      while (repeat)
      {
         oldclassname = thistag.className
      
         for (index2 in sclasses)
         {
            regex  = new RegExp('\\b' + index2 + '\\b', 'g')
            thistag.className = thistag.className.replace(regex,
               sclasses[index2])
         }

         if (thistag.className != oldclassname) repeat = true
         else repeat = false
      }
   }

   // Import Google Fonts Stylesheets
   for (index = 0 ; index < gfindex ; ++index)
   {
      var newcss = document.createElement('link')
      newcss.setAttribute('href',  gfurl + escape(gfonts[index]))
      newcss.setAttribute('rel',  'stylesheet')
      newcss.setAttribute('type', 'text/css')
      document.getElementsByTagName('head')[0].appendChild(newcss)

   }

   if (gfindex && window.opera) setTimeout(function()// Required by Opera
      { document.body.style += "" }, 1)              // to redraw browser

   // Add citations to 'citations' object
   if (cindex > 0)
   {
      var html = '<ol>'

      for (index = 0 ; index < cindex ; ++index)
         html += InsVars('<a name=cite#1></a><li>#2</li>',
            index + 1, cites[index])

      // Check that 'citations' exists before inserting HTML
      if (typeof O('citations') != UNDEF) 
         Html('citations', html + '</ol>')
   }

   // If there are unloaded images outside the current view
   if (demand) setTimeout(DoOnDemand, 10)

   // Perform on demand image loading
   function DoOnDemand()
   {
      demand = false

      for (index = 0 ; index < numtags ; ++index)
      {
         thistag = tags[index]

         if (elems[index])
         {
            demand = true

            if (Y(thistag) < (SCROLL_Y + wheight))
            {
               thistag.onload = function() { FadeIn(this, 500) }
               thistag.src    = elems[index]
               elems[index]   = ''
            }
         }
      }

      // repeat if there are still any unloaded images
      if (demand) setTimeout(DoOnDemand, 10)
   }
})


function loadsclasses(sclasses)
{
   /* 94 - 100: Superclasses */

   sclasses['clickable']   = 'nooutline pointer'
   sclasses['rssbutton']   = 'carrot1 carrot2_a smallestround b white ' +
                             'yellow_h smallbutton clickable'
   sclasses['border']      = 'bwidth1 bsolid bblack'
   sclasses['abstopleft']  = 'absolute totop toleft'
   sclasses['rollover']    = 'trans00 trans10_h'
   sclasses['rollover_h']  = 'abstopleft trans10 trans00_h'
   sclasses['vtab']        = 'leftpadding10 leftpadding40_h ' +
                             'rightpadding5 b transitionallfast_l'
   sclasses['htab']        = 'absolute center toppadding20_h b ' +
                             'transitionallfast_l'
}

/************************************************************************

   You can add more classes to your HTML using meta tags, like this...

<meta http-equiv='sclass' name='clickable' content='nooutline pointer' />

   which replicates one of the superclasses built into this script. You
   can override it, or add more superclasses with new names and values.
   You can also add them to this file using the syntax shown above.

************************************************************************/
