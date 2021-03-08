let currentPos = 'right',
    leftSide = [0, 0],
    rightSide = [3, 3],
    clickable = true;

setInterval(() => {
    if (clickable) $('.people').css('cursor', 'pointer ');
    else $('.people').css('cursor', 'default ');
}, 200);

function ride(e) {
    if (clickable) {
        // checking if the selected passenger is on the boat or not
        // if not on the boat then put them on the boat
        let attr = $(this).attr('data-pos');
        if (
            (currentPos === 'right' &&
                (typeof attr !== undefined || attr !== false)) ||
            (currentPos === 'left' && (attr == '1' || attr == true))
        ) {
            if (this.className.includes('notOnBoat')) {
                e.data.count++;
                // if there are less than two people on the boat then only put any other passenger
                if (e.data.count <= 2) {
                    $('.passengers').append(
                        $(this)
                            .addClass('onBoat')
                            .clone(true)
                            .removeClass('notOnBoat')
                    );
                    $(this).remove();
                    $('.passenger--boat').addClass('boat--ready');
                } else e.data.count = 2;
                return;
            }
        }

        //  droping the passenger on the left or right river bank according to the boat position
        if (currentPos === 'right') {
            // if passenger are on the boat then drop them
            if (this.className.includes('onBoat')) {
                e.data.count--;
                // droping missionarie in missionaries
                if (this.className.includes('missionarie')) {
                    $('.peopleOnRight .missionaries').prepend(
                        $(this)
                            .addClass('notOnBoat')
                            .clone(true)
                            .removeClass('onBoat')
                    );
                    $(this).css('cursor', 'pointer ');
                }
                // droping cannibal in cannibals
                else {
                    $('.peopleOnRight .cannibals').prepend(
                        $(this)
                            .addClass('notOnBoat')
                            .clone(true)
                            .removeClass('onBoat')
                    );
                    $(this).css('cursor', 'pointer ');
                }
                if (e.data.count === 0)
                    $('.passenger--boat').removeClass('boat--ready');

                $(this).remove();
                return;
            }
        }
        if (currentPos === 'left') {
            if (this.className.includes('onBoat')) {
                e.data.count--;
                if (this.className.includes('missionarie')) {
                    $('.peopleOnLeft .missionaries').prepend(
                        $(this)
                            .addClass('notOnBoat')
                            .clone(true)
                            .removeClass('onBoat')
                    );
                } else {
                    $('.peopleOnLeft .cannibals').prepend(
                        $(this)
                            .addClass('notOnBoat')
                            .clone(true)
                            .removeClass('onBoat')
                    );
                }
                if (e.data.count === 0)
                    $('.passenger--boat').removeClass('boat--ready');

                $(this).remove();
                return;
            }
        }
    }
}

function travel(e) {
    // checking if their is any passenger's are on the boat or not
    if ($('.passenger--boat.boat--ready').length) {
        clickable = false;
        // if the boat is on right then go left
        if (!e.data.left) {
            $('.passenger--boat.boat--ready').animate(
                { left: 0, right: e.data.offset },
                1000,
                // callback after the boat reaches the left river bank
                () => {
                    clickable = true;
                    // setting the current boat position
                    !e.data.left
                        ? (currentPos = 'right')
                        : (currentPos = 'left');

                    let miss = $('.passenger--boat .passengers .missionarie')
                            .length,
                        canni = $('.passenger--boat .passengers .cannibal')
                            .length;

                    // calculating the number of missionarie and cannibal in each bank
                    rightSide[0] -= miss;
                    rightSide[1] -= canni;
                    leftSide[0] += miss;
                    leftSide[1] += canni;

                    console.log('rightSide', rightSide);
                    console.log('leftSide', leftSide);

                    // deciding if you won or not
                    if (
                        (rightSide[1] > rightSide[0] && rightSide[0] != 0) ||
                        (leftSide[1] > leftSide[0] && leftSide[0] != 0)
                    ) {
                        $('.alert.alert-danger.result').css('display', 'block');
                        $('.action--btns button').prop('disabled', true);
                        clickable = false;
                    }

                    if (leftSide[0] === 3 && leftSide[1] === 3) {
                        // automatically put every person who is on the boat to the left bank
                        if (miss)
                            $.each(
                                $('.passenger--boat .passengers .missionarie'),
                                (i, el) => {
                                    $('.peopleOnLeft .missionaries').prepend(
                                        $(el)
                                            .addClass('notOnBoat')
                                            .clone(true)
                                            .removeClass('onBoat')
                                    );
                                    $('.passenger--boat').removeClass(
                                        'boat--ready'
                                    );
                                    $(el).remove();
                                }
                            );
                        if (canni)
                            $.each(
                                $('.passenger--boat .passengers .cannibal'),
                                (i, el) => {
                                    $('.peopleOnLeft .cannibals').prepend(
                                        $(el)
                                            .addClass('notOnBoat')
                                            .clone(true)
                                            .removeClass('onBoat')
                                    );
                                    $('.passenger--boat').removeClass(
                                        'boat--ready'
                                    );
                                    $(el).remove();
                                }
                            );
                        // after winning all buttons except the 'play again' button should be disabled
                        $('.alert.alert-success.result').css(
                            'display',
                            'block'
                        );
                        $('.action--btns button').prop('disabled', true);
                        clickable = false;
                    }
                }
            );
            // setting the attr so that we can identify that the person is on right river bank or left river bank
            $('.passenger--boat .passengers .missionarie').attr('data-pos', 1);
            $('.passenger--boat .passengers .cannibal').attr('data-pos', 1);
        }
        // if the boat is on left then go right
        else {
            $('.passenger--boat.boat--ready').animate(
                { left: e.data.offset, right: 0 },
                1000,
                // callback after the boat reaches the right river bank
                () => {
                    clickable = true;
                    // setting the current boat position
                    !e.data.left
                        ? (currentPos = 'right')
                        : (currentPos = 'left');

                    let miss = $('.passenger--boat .passengers .missionarie')
                            .length,
                        canni = $('.passenger--boat .passengers .cannibal')
                            .length;

                    // calculating the number of missionarie and cannibal in each bank
                    leftSide[0] -= miss;
                    leftSide[1] -= canni;
                    rightSide[0] += miss;
                    rightSide[1] += canni;

                    console.log('rightSide', rightSide);
                    console.log('leftSide', leftSide);

                    // deciding  factor
                    if (
                        (rightSide[1] > rightSide[0] && rightSide[0] != 0) ||
                        (leftSide[1] > leftSide[0] && leftSide[0] != 0)
                    ) {
                        $('.alert.alert-danger.result').css('display', 'block');
                        $('.action--btns button').prop('disabled', true);
                        // after loosing all buttons except the 'play again' button should be disabled
                        clickable = false;
                    }
                }
                // callback has been run after every boat moment with slight variation
            );
        }
        // changing the boat position status on every click
        e.data.left = !e.data.left;
    }
}

$(document).ready(function () {
    let count = 0,
        left = false,
        offset = document.querySelector('.passenger--boat').offsetLeft;
    $('.people').click({ count, left }, ride);
    $('.go').click({ count, offset }, travel);
    $('.reset').click(() => location.reload());
});
