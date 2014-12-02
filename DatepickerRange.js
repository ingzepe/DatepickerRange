/*
 * funcion para agregar un datepicker con rango.
 */
$.datepicker._defaults.onAfterUpdate = null;
var datepicker__updateDatepicker = $.datepicker._updateDatepicker;
$.datepicker._updateDatepicker = function( inst ) {
   datepicker__updateDatepicker.call( this, inst );
   var onAfterUpdate = this._get(inst, 'onAfterUpdate');
   if (onAfterUpdate)
      onAfterUpdate.apply((inst.input ? inst.input[0] : null),  [(inst.input ? inst.input.val() : ''), inst]);
};

$.widget("custom.DatepickerRange", {
    _create: function () {
        var cur = - 1, prv = - 1;
        $("<div></div>")
            .css({'position':'absolute', 'z-index':'100'})
            .insertAfter(this.element)
            .datepicker({
        changeMonth: true,
        changeYear: true,
        showButtonPanel: true,
        numberOfMonths: 2,
        beforeShowDay: function (date) {
            return [true, ((date.getTime() >= Math.min(prv, cur) && date.getTime() <= Math.max(prv, cur)) ? 'date-picker-range' : '')];
        },
        
        onSelect: function (dateText, inst) {
            var d1, d2;
            prv = cur;
            cur = (new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay)).getTime();
            if (prv == - 1 || prv == cur) {
                prv = cur;
                $(this).parent().children("input").val(dateText);
            } else {
                d1 = $.datepicker.formatDate('yy-mm-dd', new Date(Math.min(prv, cur)), {});
                d2 = $.datepicker.formatDate('yy-mm-dd', new Date(Math.max(prv, cur)), {});
                $(this).parent().children("input").val(d1 + ' - ' + d2);
            }
        },
        
        onChangeMonthYear: function (year, month, inst) {
            //prv = cur = -1;
        },
        
        onAfterUpdate: function (inst) {
            //$(this).find('.ui-datepicker-buttonpane').empty();
            $('<button type="button" class="btn btn-primary btn-sm"  > Aceptar </button>')
                .appendTo($(this).find('.ui-datepicker-buttonpane'))
                .on('click', function () {
                        $(this).parent().parent().parent().hide(); 
                    });
        }
        }).hide();
    
        this.element.on('focus', function (e) {
            var v = $(this).value, d;
            try {
                if (v.indexOf(' - ') > - 1) {
                    d = v.split(' - ');
                    prv = $.datepicker.parseDate('yy-mm-dd', d[0]).getTime();
                    cur = $.datepicker.parseDate('yy-mm-dd', d[1]).getTime();
                } else if (v.length > 0) {
                    prv = cur = $.datepicker.parseDate('yy-mm-dd', v).getTime();
                }
            } catch (e) {
                cur = prv = - 1;
            }

            if (cur > - 1)
                $(this).parent().children("div").datepicker('setDate', new
                Date(cur));
                $(this).parent().children("div").datepicker('refresh').show();
        });
    }
});

$('.DatepickerRange').DatepickerRange();
