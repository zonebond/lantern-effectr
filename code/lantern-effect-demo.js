
var box, stack, total_nums = 10, scaled = 0.8;

$(window.document.body).ready(function()
{
    switch_arrow_interactive();

    built_lanterns();
});

function switch_arrow_interactive()
{
    var switch_arrow = $(".switch-arrow");
    switch_arrow.mouseover(function(evt)
    {
        switch_arrow.css('opacity', 0.3);
    });
    switch_arrow.mouseout(function(evt)
    {
        switch_arrow.css('opacity', 0.0);
    });

    switch_arrow.click(function(evt)
    {
        if(!stack)
        {
            return;
        }

        var target = $(evt.target);

        if(target.hasClass("left"))
        {
            stack.go_prev();
        }
        else
        {
            stack.go_next();
        }

    });
}

function built_lanterns(nums, default_index)
{
    box = $("#box"), stack = $("#lantern-stack"), stack.gap = 30;

    var size = box.width(), long = box.height();
    var len = nums || total_nums;

    for(var i = 0; i < len; i++)
    {
        var lantern = $("<div class='lantern show-border'>" + i + "</div>");

        lantern.width(size);
        lantern.height(long);

        stack.append(lantern);
    }

    stack.width((box.width() + stack.gap) * (len + 1));

    stack.last_index = default_index || 0;
    stack.size = size;
    stack.go_prev = prev;
    stack.go_next = next;
    stack.transform = transform;

    stack.css("left", getPosition(stack.last_index) + "px");
}

function prev()
{
    moveToIndex(stack.last_index - 1);
}

function next()
{
    moveToIndex(stack.last_index + 1);
}

function moveToIndex(index)
{
    if(illegal(index))
    {
        return;
    }

    if(stack.queue().length)
    {
        stack.stop()
        stack.clearQueue();
    }

    var ori = getOriginal(stack.last_index),
        pos = getPosition(index),
        side = getBetweenSide(index);

    stack.animate(
        {left: ori},
        {
            duration: 500,
            start:function()
            {
                stack.css('transform', 'matrix(' + scaled + ', 0, 0, ' + scaled + ', ' + side[0] + ', 0)');
            }
        }
    ).animate(
        {left: pos * 0.8},
        {
            duration: 500,
            done: function()
            {
                stack.css('transform', 'matrix(1.0, 0, 0, 1.0, ' + side[1] + ', 0)');
            }
        }
    );

    stack.last_index = index;
}

function illegal(index)
{
    return (index < 0 || index > stack.children().length - 1) ? true : false;
}

function getBetweenSide(index)
{
    var les = 1 - scaled;
    var res = les * 0.5;
    var origin = (stack.width() + 2) * -1;
    var offset = stack.size + stack.gap + 2;

    return [(origin + stack.size) * res, offset * les * -1 * index];
}

function getOriginal(index)
{
    var offset = stack.size + stack.gap + 2;

    return offset * index * -1 * scaled;
}

function getPosition(index)
{
    var offset = stack.size + stack.gap + 2;
    return offset * index * -1;
}

function transform(matrix)
{
    this.css('-webkit-transform', matrix);
    this.css('-moz-transform', matrix);
    this.css('-ms-transform', matrix);
    this.css('-o-transform', matrix);
    this.css('transform', matrix);
}