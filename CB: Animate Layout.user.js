// ==UserScript==
// @name            CB: Animate Thumbnail & Re-Layout
// @author          nima-rahbar
// @namespace       https://greasyfork.org/en/users/846327-nima-rahbar
// @icon            https://www.google.com/s2/favicons?sz=64&domain=chaturbate.org
// @description     Make custom grid thumbnails & Animated rooms on mouse hover (Using Chaturbate Animate Thumbnail by iXXX94)
// @copyright       2022, nima-rahbar (https://greasyfork.org/en/users/846327-nima-rahbar)
// @license         MIT
// @version         1.2.3
// @homepageURL     https://greasyfork.org/en/scripts/437111-chaturbate-animate-thumbnail-re-layout
// @homepage        https://greasyfork.org/en/scripts/437111-chaturbate-animate-thumbnail-re-layout
// @supportURL      https://greasyfork.org/en/scripts/437111-chaturbate-animate-thumbnail-re-layout/feedback
// @require         https://cdn.jsdelivr.net/npm/jquery@3.6.0
// @require         https://cdn.jsdelivr.net/npm/@violentmonkey/dom@1.0.9
// @match           *://*.chaturbate.com/*
// @run-at          document-idle
// ==/UserScript==

/* global $, VM */

(() => {
  $("#nav").append(
    '<li><a href="#" class="reset-grids" style="display: flex; align-items: center; column-gap: 5px;"><img style="height:17px;" alt="Reset Grid Count" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAA7EAAAOxAGVKw4bAAADBElEQVR4nO1bMWsUQRh9sxyHoklODRIwWARBUUklUQTFxkZbiwiCWCsoiiBoZyFoIYhNOgsr/0EEc2ClFimCWAjGIAFBUgQRlOO8Z+FeWGe+uf0gkA9v5sE07+7tvP32229ndmccyQaA+wBmkRYWAFx3JB8AuGPtxggvCgAnrF0YYqawdmCNRoTvVdogNAWuo+i3EPruAegqtI1SX0UXoVf/P4XAhUSJIwBGyrYDwHahHRR0y5H/+u2WoH2q1C4I2rOlzxGvjQHYVbY9EC6OlAE9AGvOuV/CbxsgKWaHc64ua2La3ia1tdlDsgMva2MZUGtkWJBaAIIsSf4pkFoAcgb4yAGwNrDFCIp7bCR4mOSPmoNNCFyT5LTCyD6BG1dqRwVuiuS6QhucryPZBnBGIR5GrKR2CwTIAbA2YI1YEVxC/dS0CeCox3UAvFf0uxfApMd9A7Cq0B5AWAg/Aqgr2gAwDf+cSbb5L36TbNUdieR+hvikMAGS1wTtY6V2XtCeVmq/errPyd8COQDWBqyRA2BtwBo5ANYGrJF8AGIjwdskf9ZoxwSuRfKeot/jAjej1E4J3GXlYGinT+TpsLUDa+QAWBuwRuzb4EPUf+UdBXDD49YBPFH0ewzAOY97A+ClQnsJYSF8BuCLQnsTfiHM0+HEkQNgbcAaOQDWBqyRA2BtwBrJB0AaCRYAXpGs+zCyTeAmSb5V9Ct9WZ4leVKhPSRwcyS/K7TjPpGnw9YOrJEDYG3AGrHp8CnUf22dADDvcasAziv6vYhwj8JzAI8U2jmES/yvAFhUaNsAdleJ2EvRD865gWtuKK/J6TjnlupcRKava0qtVO2XlVr1OsFhvTXUy+WTQQ5AhI/Vhv8dwXlJAUgqK1IrgqoMSAqxe71Ved72n50bu8g0e3ssQLJ6QfvnVlSaeq1wdcAgblIqDyhtmxu42apizjfThW7bXBNh5nYqnnxIQeljJZYBm3kKSO8JNJCCooV0IVRIvgYUAN5ZmzDEYgPAXfwNxAVjM1uN1wCu/gFdn51EBIXtygAAAABJRU5ErkJggg==" /> Reset Grid Count</a></li>'
  )
  $("body").on("click", ".reset-grids", function () {
    var grids = prompt(
      "Enter layout grids count (between 4 and 10):",
      localStorage.getItem('grid-count')
    )
    if (grids) {
      if (grids > 10) grids = 10
      if (grids < 4) grids = 4
      localStorage.setItem('grid-count', grids)
    }
    location.reload()
  })
  VM.observe(document.body, () => {
    // Change Layout
    function custom_layout(grid_count) {
      $("body .c-1").css({
        margin: "0 auto",
      })
      $("body")
        .find(".list li")
        .css({
          width: $("body .c-1").outerWidth() / grid_count - 15,
          height: "auto",
          maxHeight: `${170 + (11 - grid_count) * (3 * (12 - grid_count))}px`, // 4
          margin: "5px",
          overflow: "hidden"
        })
      $("body").find(".list img").css({
        width: "100%",
        height: "auto",
      })
    }

    var oldXHR = window.XMLHttpRequest
    function newXHR() {
      var realXHR = new oldXHR()
      realXHR.addEventListener(
        "readystatechange",
        function () {
          if (realXHR.readyState == 4) {
            setTimeout(custom_layout, 400)
          }
        },
        false
      )
      return realXHR
    }
    window.XMLHttpRequest = newXHR

    const rooms = $(
      "#discover_root .room_list_room, #room_list .room_list_room, #broadcasters .room_list_room, .followedContainer .roomElement"
    )

    if (rooms.length > 0) {
      // if rooms exists
      var grids = 11
      if (!localStorage.getItem("grid-count")) {
        grids = prompt("Enter layout grids count:", "11")
        if (grids) {
          localStorage.setItem('grid-count', grids)
        }
      } else {
        grids = localStorage.getItem('grid-count')
      }
      custom_layout(grids)
      var grid_template_columns = "repeat(" + grids + ", 1fr)"
      $("#room_list").css({
        "grid-template-columns": grid_template_columns,
        "grid-template-rows": "auto",
        "grid-column-gap": "5px",
        "grid-row-gap": "15px",
        position: "relative",
        left: 0,
      }) // to be able to scale, on room list
      $("#room_list .room_list_room").css(
        "transition",
        "transform .1s ease-in-out"
      )
      $(".isIpad #room_list .room_list_room *, #broadcasters .room_list_room *")
        .css("user-select", "none")
        .css("-webkit-touch-callout", "none")

      $(rooms).each((index, element) => {
        // for each room
        let timer
        const name = $(element).find("> a").data("room")
          ? $(element).find("> a").data("room")
          : $(element)
            .find("> .user-info > .username > a")
            .text()
            .replace(/^\s/g, "")
        const thumbnail = $(element).find("> a img")

        $(element)
          .bind("pointerdown", (event) => {
            element.releasePointerCapture(event.pointerId)
          })
          .bind("pointerenter", (event) => {
            // start
            var firstQ = $("body .c-1").innerWidth() / 5,
              lastQ = firstQ * 4,
              origin = "center center",
              originX = "center",
              originY = "center"
            if (event.pageX < firstQ) {
              originX = "left"
            } else if (event.pageX > lastQ) {
              originX = "right"
            }
            if (event.pageY < $(document).innerHeight() / 4) {
              originY = "top"
            } else if (event.pageY > $(document).innerHeight() / 4) {
              originY = "bottom"
            }
            origin = originX + " " + originY

            if ($(element).parent("#room_list").length > 0) {
              // scale only on room list
              $(element)
                .css("transform-origin", origin)
                .css("transform", "translateX(0px) scale(1.5)")
                .css("z-index", "999")
            }

            timer = setInterval(
              () => {
                // animate thumbnail
                $(thumbnail).attr(
                  "src",
                  //`https://roomimg.stream.highwebmedia.com/riw/${name}.jpg?f=${Date.getTime().now()}`
                  `https://cbjpeg.stream.highwebmedia.com/minifwap/${name}.jpg?f=${Date.now()}`
                )
              }, 660
            )
          })
          .bind("pointerup pointerleave", (event) => {
            // stop
            if ($(element).parent("#room_list").length > 0) {
              // scale only on room list
              $(element)
                .css("transform-origin", "center center")
                .css("transform", "translateX(0px) scale(1)")
                .css("z-index", "0")
            }

            clearInterval(timer) // stop animate thumbnail
            timer = undefined
          })
      })

      return false
    }
  })
})()