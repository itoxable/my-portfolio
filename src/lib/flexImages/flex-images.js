/*
    JavaScript flexImages v1.0.2
    Copyright (c) 2014 Simon Steinberger / Pixabay
    GitHub: https://github.com/Pixabay/JavaScript-flexImages
    License: http://www.opensource.org/licenses/mit-license.php
*/

var flexImages = (function(){
    "use strict";
    function flexImages(options){
        if (!document.querySelector) return;

        var defaultOptions = { selector: 0, container: '.item', object: 'img', rowHeight: 180, maxRows: 0, truncate: 0 };
        for (var key in options) {
            if (options.hasOwnProperty(key)) defaultOptions[key] = options[key];
        }

        this.grids = typeof defaultOptions.selector === 'object' ? [defaultOptions.selector] : document.querySelectorAll(defaultOptions.selector);

        for (var i = 0; i < this.grids.length; i++) {
            var grid = this.grids[i], containers = grid.querySelectorAll(defaultOptions.container), items = [], currentTime = new Date().getTime();
            if (!containers.length){
                continue;
            }

            var currentStyle = window.getComputedStyle ? getComputedStyle(containers[0], null) : containers[0].currentStyle;

            defaultOptions.margin = (parseInt(currentStyle.marginLeft) || 0) + (parseInt(currentStyle.marginRight) || 0) + (Math.round(parseFloat(currentStyle.borderLeftWidth)) || 0) + (Math.round(parseFloat(currentStyle.borderRightWidth)) || 0);


            for (var j = 0; j < containers.length; j++) {
                var container = containers[j],
                    width = parseInt(container.getAttribute('data-w')),
                    normalizedWidth = width*(defaultOptions.rowHeight/parseInt(container.getAttribute('data-h'))), // normalized width
                    obj = container.querySelector(defaultOptions.object);

                items.push([
                    container,
                    width,
                    normalizedWidth,
                    obj,
                    obj.getAttribute('data-src')]);
            }

            this.makeGrid(grid, items, defaultOptions);
            var tempf = function() { this.makeGrid(grid, items, defaultOptions);}.bind(this);
            if (document.addEventListener) {
                window['flexImages_listener'+currentTime] = tempf;
                window.removeEventListener('resize', window['flexImages_listener'+grid.getAttribute('data-flex-t')]);
                delete window['flexImages_listener'+grid.getAttribute('data-flex-t')];
                window.addEventListener('resize', window['flexImages_listener'+currentTime]);
            } else{
                grid.onresize = tempf;
            }

            grid.setAttribute('data-flex-t', currentTime)
        }
    }

    flexImages.prototype.reRender = function(){
        console.log('--reRender--');
    }

    flexImages.prototype.filter = function(filter){
        console.log('--filter--');
        for (var i = 0; i < this.grids.length; i++){

        }
    }

    flexImages.prototype.makeGrid = function(grid, items, options, noresize){
        var currentImageIndex,
            newWidth, exact_w,
            ratio = 1,
            rows = 1,
            maxWidth = grid.clientWidth-2,
            row = [],
            row_width = 0,
            h,
            row_h = options.rowHeight;

        // define inside makeGrid to access variables in scope
        function _helper(lastRow){
            // console.log('xx helper');
            if (options.maxRows && rows > options.maxRows || options.truncate && lastRow && rows > 1) row[currentImageIndex][0].style.display = 'none';
            else {
                // console.log(row[currentImageIndex][4]);
                if (row[currentImageIndex][4]) {
                    row[currentImageIndex][3].setAttribute('src', row[currentImageIndex][4]);
                    row[currentImageIndex][4] = '';
                }
                row[currentImageIndex][0].style.width = newWidth+'px';
                row[currentImageIndex][0].style.height = row_h+'px';
                row[currentImageIndex][0].style.display = 'block';
            }
        }

        for (var i = 0; i < items.length; i++) {
            row.push(items[i]);
            row_width += items[i][2] + options.margin;
            if (row_width >= maxWidth) {
                var margins_in_row = row.length * options.margin;
                ratio = (maxWidth-margins_in_row) / (row_width-margins_in_row), row_h = Math.ceil(options.rowHeight*ratio), exact_w = 0, newWidth;
                for (currentImageIndex = 0; currentImageIndex < row.length; currentImageIndex++) {
                    newWidth = Math.ceil(row[currentImageIndex][2]*ratio);
                    exact_w += newWidth + options.margin;
                    if (exact_w > maxWidth) newWidth -= exact_w - maxWidth;
                    _helper();
                }
                // reset for next row
                row = [], row_width = 0;
                rows++;
            }
        }
        // layout last row - match height of last row to previous row
        for (currentImageIndex = 0; currentImageIndex < row.length; currentImageIndex++) {
            newWidth = Math.floor(row[currentImageIndex][2]*ratio),
                h = Math.floor(options.rowHeight*ratio);
            _helper(true);
        }

        // scroll bars added or removed during rendering new layout?
        if (!noresize && maxWidth != grid.clientWidth){
            this.makeGrid(grid, items, options, true);
        }
    }




    return flexImages;
})();

(function(){
    if (typeof define === 'function' && define.amd)
        define('flexImages', function () { return flexImages; });
    else if (typeof module !== 'undefined' && module.exports)
        module.exports = flexImages;
    else
        window.flexImages = flexImages;
})();
