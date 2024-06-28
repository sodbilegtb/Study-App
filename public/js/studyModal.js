let answers = [];
let deckId;
$(document).ready(() => {
    $(".study-modal-button").click(() => {
        $(".modal-header").html("");
        $(".modal-body").html("");
        let $button = $(event.target);
        deckId = $button.data("id");
        $.get(`/api/decks/${deckId}`, (results = {}) => {
            let res = results.data;
            if (res) {
                let deck = res.deck;
                console.log(deck.name)
                let cards = deck.cards;
                removeButtons();
                addStartButton();
                addStartButtonListener(deck);
                $(".modal-header").append(`
                    <h4 class="modal-title">${deck.name}</h4>
                `);
                $(".modal-body").append(`<div><h5>Cards</h5></div>`);
                cards.forEach((card) => {
                    answers.push("");
                    $(".modal-body").append(
                        `<div class="row">
                            <div class="col-2">${card.name}</div>
                            <div class="col">${card.front_text}</div>
                        </div>`)
                })
            }
        })
    })
})

let addStartButtonListener = (deck) => {
    $("#study-modal-start-btn").click(() => {
        // https://www.freecodecamp.org/news/how-to-sort-array-of-objects-by-property-name-in-javascript/
        fillModalBody(0, deck.cards.sort((a, b) => a.times_incorrect - b.times_incorrect)[0]);
        removeButtons();
        addPreviousButton();
        $("#prev-btn").prop("disabled", true); // https://www.scaler.com/topics/disable-button-jquery/
        addNextButton();
        addNextButtonListener(1, deck.cards);
    })
}

let addNextButtonListener = (index, cards) => {
    $("#next-btn").click(() => {
        let answer = $("#answer").val();
        answers[index - 1] = answer;
        let card = cards.sort()[index];
        fillModalBody(index, card);
        removeButtons();
        addPreviousButton();
        addPreviousButtonListener(index - 1, cards);
        if (index < cards.length - 1) {
            addNextButton();
            addNextButtonListener(index + 1, cards);
        } else {
            addCheckAnswersButton();
            //addCheckAnswersButtonListener(deckId);
        }
    })
}

let addPreviousButtonListener = (index, cards) => {
    $("#prev-btn").click(() => {
        answers[index + 1] = $("#answer").val();
        removeButtons();
        if (index >= 0) {
            let card = cards.sort()[index];
            fillModalBody(index, card);
        }
        if (index > 0) {
            addPreviousButton();
            addPreviousButtonListener(index - 1, cards);
        } else {
            addPreviousButton();
            $("#prev-btn").prop("disabled", true); // https://www.scaler.com/topics/disable-button-jquery/
        }
        addNextButton();
        addNextButtonListener(index + 1, cards);
    })
}

let addCheckAnswersButtonListener = (deckId) => {
    $("#check-btn").click(() => {
        $('#modal').modal('toggle'); // Close the modal
    })
}

let fillModalBody = (index, card) => {
    $(".modal-title").html(`${card.name}`);
    $(".modal-body").html("");
    $(".modal-body").append(`
        <div>
            <p><strong>${card.front_text}</strong></p>
        </div>
        <div>
            <textarea id="answer" name="answer" style="width: 100%; height: 150px">${answers[index]}</textarea>
        </div>
    `);
}

let removeButtons = () => {
    $(".modal-footer").html("");
}

let addStartButton = () => {
    $(".modal-footer").append(
        `<button id="study-modal-start-btn" class="btn btn-primary" type="button">Start</button>`
    );
}

let addNextButton = () => {
    $(".modal-footer").append(
        `<button id="next-btn" class="btn btn-primary" type="button">Next</button>`
    )
}

let addPreviousButton = () => {
    $(".modal-footer").append(
        `<button id="prev-btn" class="btn btn-secondary" type="button">Previous</button>`);
}

let addCheckAnswersButton = () => {
    let href = `/decks/${deckId}/study`;
    $(".modal-footer").append(
        `<a id="check-btn" href=${href} class="btn btn-success" type="button">Check answers</a>`
    )
}