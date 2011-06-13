/*
	rotate360 v0.1
	by Rickyh.co.uk & Oliveta
	powered by Mootools
*/
Rotate360_element = new Class({
    Implements: [Options],
    options: {
        autoPlay: false,
        tickAmount: 10,
        speed: 25,
		firstFrame:0,
    },
    initialize: function (el, control, height, options) {
        this.setOptions(options);
        this.imageAmount = height / el.getSize().y;
        this.el = el;
        this.mdown = false;
		this.posun_x = 0;
        this.posXori = 0;
		if (this.options.firstFrame>0 && this.options.firstFrame<this.imageAmount) {this.i = this.options.firstFrame-1;this.nextImage();}
		else this.i=0;
      
        if (!this.options.autoPlay) {
            control.addEvents({
                'mousedown': function (e) {
                    e.preventDefault(); 
                    this.options.autoPlay = false;
                    this.mdown = true;
                    this.posXori = e.page.x;
                }.bind(this),
                'mouseup': function (e) {
                    if (this.mdown) {
                        this.mdown = false;
                    }
                }.bind(this),
                'mouseleave': function (e) {
                    this.mdown = false;
                }.bind(this),
                'mousemove': function (e) {
                    if (this.mdown) {
                        var moveto = parseInt((e.page.x - this.posXori) / this.options.tickAmount);
                        if (moveto >= 1) {
                            this.posXori = e.page.x;
                            this.moveForward();
                        }
                        if (moveto <= -1) {
                            this.posXori = e.page.x;
                            this.moveBack();
                        }
                    }
                }.bind(this)
            }); //end addEvents
        }
        else {
            this.nextImage.periodical(51 - (this.options.speed * 5), this);
        }
    },
    nextImage: function () {
        this.i++;
        if (this.i == this.imageAmount) {
            i = 0;
        }
	     this.el.setStyle("background-position", this.posun_x + "px " + (-this.i * this.el.getSize().y) + "px");
    },
    moveForward: function () {
        this.i++;
        if (this.i == this.imageAmount) {
            this.i = 0;
        }
        this.el.setStyle("background-position", this.posun_x + "px " + (-this.i * this.el.getSize().y) + "px");
    },
    moveBack: function () {
        this.i--;
        if (this.i == -1) {
            i = this.imageAmount - 1;
        }
        this.el.setStyle("background-position", this.posun_x + "px " + (-this.i * this.el.getSize().y) + "px");
    }
});
Rotate360 = new Class({
    Implements: [Options],
    options: {
        autoPlay: false,
        tickAmount: 10,
        speed: 5,
		firstFrame:0,
        class_el: 'imgholder',
		
    },
    initialize: function (data, options) {
		
        this.setOptions(options);
        if (this.options.speed < 1 || this.options.speed > 10) this.options.speed = 5;
        this.elmnts = {
            'data': [],
            'img': [],
            'loader': []
        };
        //elements to apply the effect
        if (!data) {
            $(document.body).getElements('[class^=' + this.options.class_el + ']').each(function (el, i) {
                if (el.getStyle('background-image') && el.getStyle('background-image') != '') {
                    el.setStyle('opacity', 0);
                    this.elmnts.data[i] = el;
                    this.elmnts.img[i] = el.getStyle('background-image').replace(/(url|\(|\)|")/g, '');
                }
            }.bind(this));
        }
        else data.each(function (e, i) {
            var el = $(e);
            if (el.getStyle('background-image') && el.getStyle('background-image') != '') {
                el.setStyle('opacity', 0);
                this.elmnts.data[i] = el;
                this.elmnts.img[i] = el.getStyle('background-image').replace(/(url|\(|\)|")/g, '');
            }
        }.bind(this));
        //preloader
        this.load();
    },
    load: function () {
        this.elmnts.data.each(function (el, i) {
            el.spin();
        });
        this.elmnts.loader = new Asset.images(this.elmnts.img, {
            onComplete: function () {
                this.elmnts.data.each(function (el, i) {
                    el.unspin();
                    this.elmnts.data[i].tween('opacity', [0, 1]);
                    var control = new Element('div', {
                        'styles': {
                            'cursor': 'move',
                            'opacity': '1',
                            'z-index': '1000',
                            'position': 'absolute',
                            'width': el.getSize().x + 'px',
                            'height': el.getSize().y + 'px',
                            'top': '0px',
                            'left': '0px'
                        },
                        'class': 'control'
                    });
                    control.inject(el, 'top');
                    var rot_el = new Rotate360_element(el, control, this.elmnts.loader[i].height, {
                        'autoPlay': this.options.autoPlay,
                        'tickAmount': this.options.tickAmount,
                        'speed': this.options.speed,
						'firstFrame':this.options.firstFrame
                    });
                }.bind(this));
            }.bind(this)
        }); //end loader
    } //end load
});
