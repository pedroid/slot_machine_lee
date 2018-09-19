$(document).ready(function() {
    /**
    * Global variables
    */
    var completed = 0,
        imgHeight = 1374,
        posArr = [
            0, //orange
            80, //number 7 
            165, //bar
            237, //guava
            310, //banana
            378, //cherry
            454, //orange
            539, //number 7
            624, //bar
            696, //guava
            769, //banana
            837, //cherry
            913, //orange
            1000, //number 7
            1085, //bar
            1157, //guava
            1230, //banana
            1298 //cherry
        ];
    
    var win = [];
    win[0] = win[454] = win[913] = 1;
    win[80] = win[539] = win[1000] = 2;
    win[165] = win[624] = win[1085] = 3;
    win[237] = win[696] = win[1157] = 4;
    win[310] = win[769] = win[1230] = 5;
    win[378] = win[837] = win[1298] = 6;

    /**
    * @class Slot
    * @constructor
    */
    function Slot(el, max, step) {
        this.speed = 0; //speed of the slot at any point of time
        this.step = step; //speed will increase at this rate
        this.si = null; //holds setInterval object for the given slot
        this.el = el; //dom element of the slot
        this.maxSpeed = max; //max speed this slot can have
        this.pos = null; //final position of the slot    

        $(el).pan({
            fps:30,
            dir:'down'
        });
        $(el).spStop();
    }

    /**
    * @method start
    * Starts a slot
    */
    Slot.prototype.start = function() {
        var _this = this;
        $(_this.el).addClass('motion');
        $(_this.el).spStart();
        _this.si = window.setInterval(function() {
            if(_this.speed < _this.maxSpeed) {
                _this.speed += _this.step;
                $(_this.el).spSpeed(_this.speed);
            }
        }, 100);
    };

    /**
    * @method stop
    * Stops a slot
    */
    Slot.prototype.stop = function() {		

		
        var _this = this,
            limit = 30;
        clearInterval(_this.si);
        _this.si = window.setInterval(function() {
            if(_this.speed > limit) {
                _this.speed -= _this.step;
                $(_this.el).spSpeed(_this.speed);
            }
            if(_this.speed <= limit) {
                _this.finalPos(_this.el);
                $(_this.el).spSpeed(0);
                $(_this.el).spStop();
                clearInterval(_this.si);
                $(_this.el).removeClass('motion');
                _this.speed = 0;				
            }
        }, 200);
		
    };

    /**
    * @method finalPos
    * Finds the final position of the slot
    */
    Slot.prototype.finalPos = function() {
        var el = this.el,
            el_id,
            pos,
            posMin = 2000000000,
            best,
            bgPos,
            i,
            j,
            k;

        el_id = $(el).attr('id');
        //pos = $(el).css('background-position'); //for some unknown reason, this does not work in IE
        pos = document.getElementById(el_id).style.backgroundPosition;
        pos = pos.split(' ')[1];
        pos = parseInt(pos, 10);

        for(i = 0; i < posArr.length; i++) {
            for(j = 0;;j++) {
                k = posArr[i] + (imgHeight * j);
                if(k > pos) {
                    if((k - pos) < posMin) {
                        posMin = k - pos;
                        best = k;
                        this.pos = posArr[i]; //update the final position of the slot
                    }
                    break;
                }
            }
        }

        best += imgHeight + 4;
        bgPos = "0 " + best + "px";
        $(el).animate({
            backgroundPosition:"(" + bgPos + ")"
        }, {
            duration: 200,
            complete: function() {
                completed ++;
            }
        });
    };
    
    /**
    * @method reset
    * Reset a slot to initial state
    */
    Slot.prototype.reset = function() {
        var el_id = $(this.el).attr('id');
        $._spritely.instances[el_id].t = 0;
        $(this.el).css('background-position', '0px 4px');
        this.speed = 0;
        completed = 0;
        $('#result').html('');
    };

    function enableControl() {
        $('#control').attr("disabled", false);		
		
    }

    function disableControl() {		
        $('#control').attr("disabled", true);		
		
    }


    //create slot objects
    var a = new Slot('#slot1', 40, 3),
        b = new Slot('#slot2', 70, 3),
        c = new Slot('#slot3', 100, 3);

    /**
    * Slot machine controller
    */
    $('#control').click(function() {
        var x;
        if(this.innerHTML == "Start") {
			if(isNaN(parseInt($('#total_number').val()) )){
				alert('please insert a valid total number');
			}else{
				total_num = parseInt($('#total_number').val());
				a.start();
				b.start();
				c.start();
				this.innerHTML = "Stop";
				
				disableControl(); //disable control until the slots reach max speed
				$("#control").css("background-color","#cdb79e");
				//check every 100ms if slots have reached max speed 
				//if so, enable the control
				x = window.setInterval(function() {
					if(a.speed >= a.maxSpeed && b.speed >= b.maxSpeed && c.speed >= c.maxSpeed) {
						enableControl();
						$("#control").css("background-color","#f4511e");
						window.clearInterval(x);
					}
				}, 100);
			}
        } else if(this.innerHTML == "Stop") {			
		/*
			if(window.location.href.split('?')[1]){						
				total_num = parseInt(window.location.href.split('?')[1].split('=')[1]);
				console.log(total_num);
			}else{
				total_num = 0;
				
			}			
			*/

			
			var random_var = Math.floor(Math.random() * total_num)+1;  
			console.log(random_var);
			
			var hund = Math.floor(random_var/100);
			random_var = random_var - hund*100;
			var ten = Math.floor(random_var/10);
			random_var = random_var - ten*10;
			var one = Math.floor(random_var);			
			var pixel_array=[];
			pixel_array = ["190", "35", "1530", "1365", "1190", "1020", "850", "680", "510", "340"];
            a.stop();
            b.stop();
            c.stop();
            this.innerHTML = "Reset";
			$("#control").css("background-color","#cdb79e");
            disableControl(); //disable control until the slots stop
            
            //check every 100ms if slots have stopped
            //if so, enable the control
            x = window.setInterval(function() {
				//85px: 9, 160: 8, 237: 7, 320:6, 405: 5, 485:4, 560:3, 630:2, 700:1"

				if(a.speed === 0){
					
					$('#slot1').css("background-position", "0px "+ pixel_array[hund] +"px");
					//console.log("slot1:"+ hund);
				}
				if(b.speed === 0){
					$('#slot2').css("background-position", "0px "+ pixel_array[ten] +"px");
					//console.log("slot2:"+ ten);
				}
				if(c.speed === 0){					
					$('#slot3').css("background-position", "0px "+ pixel_array[one] +"px");
					//console.log("slot3:"+ one);
				}
                if(a.speed === 0 && b.speed === 0 && c.speed === 0 && completed === 3) {
                    enableControl();
					$("#control").css("background-color","#f4511e");
                    window.clearInterval(x);
					
                }
            }, 50);			
			
			
        } else { //reset
            a.reset();
            b.reset();
            c.reset();
            this.innerHTML = "Start";
        }
    });
});
