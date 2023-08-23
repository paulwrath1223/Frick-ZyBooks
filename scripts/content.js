





const e = new Event("change");

let still_working = true;
let loading_stage = true;
let done_with_stupid_problems = false;
let listeners_attached = false;
let currentUrl = location.href;


//
setInterval(function() {
  console.log("c")
  if(!(currentUrl === location.href)){
    still_working = true;
    loading_stage = true;
    done_with_stupid_problems = false;
    listeners_attached = false;
    currentUrl = location.href;
  }
  if(loading_stage){
    console.log("loading")
    loading_stage = (document.getElementsByClassName("zybook-section-title").length === 0);
  } else {
    console.log("a")
    if(!listeners_attached){
      console.log("b")
      attach_button_event_listeners()
      listeners_attached = true;
    }
    // if(still_working){
    //   tick_handler();
    // } else {
    //   if(!done_with_stupid_problems){
    //     alert("Removed stupid ass problems");
    //     done_with_stupid_problems = true;
    //   }
    // }
  }
}, 2000);


function tick_handler(){
  console.log("start tick_handler still_working state: " + still_working);
  let animation_tick_working = animation_tick();
  still_working = animation_tick_working;
  console.log("post animation_tick still_working state: " + animation_tick_working)
  let short_answer_tick_working = short_answer_tick();
  still_working = still_working || short_answer_tick_working
  console.log("post short_answer_tick still_working state: " + short_answer_tick_working)
  let mcq_tick_working = mcq_tick();
  still_working = still_working || mcq_tick_working
  console.log("post mcq_tick still_working state: " + mcq_tick_working)
}


// "interactive-activity-container animation-player-content-resource participation large ember-view" animation div class name
function get_animation_div_ids(){
  let id_array = [];
  let animation_divs = document.getElementsByClassName("interactive-activity-container animation-player-content-resource participation large ember-view");
  if(animation_divs.length === 0){
    console.log("no animation problems");
  } else {
    for (let i = 0; i < animation_divs.length; i++) {
      id_array.push(animation_divs.item(i).id);
    }
  }
  return id_array;
}


/*
button html DOM to add event listener to:

<div aria-label="Activity not completed" role="img" class="zb-chevron  title-bar-chevron grey   chevron-outline large">

</div>
 */

/*
EXAMPLE

function myAlert(){
  alert('hello world');
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('alertButton').addEventListener('click', myAlert);
});
*/

function attach_button_event_listeners(){
  console.log("did thing1")
  let button_divs = document.getElementsByClassName("zb-chevron  title-bar-chevron grey   chevron-outline large")
  let item;
  for (let i = 0; i < button_divs.length; i++) {
    item = button_divs.item(i);
    document.addEventListener('click', (event) => {
      button_click_listener(event);
    });
  }

}

function button_click_listener(event_var){
  console.log(event_var);
}


/*
Returns true if solved, false if error
 */
function finish_animation(animation_div_id) {
  while(true){
    let animations = document.getElementById(animation_div_id).getElementsByClassName("zb-button  primary  raised           start-button start-graphic");
    let speed_check_box_divs = document.getElementById(animation_div_id).getElementsByClassName("zb-checkbox   grey label-present right")
    for (let i = 0; i < speed_check_box_divs.length; i++) {
      let input_element = speed_check_box_divs.item(i).getElementsByTagName("input")
      if(input_element.length === 1) {
        if(input_element.item(0).checked === false){
          input_element.item(0).click();
        }
        input_element.item(0).dispatchEvent(e);
      } else {
        console.error("Checkbox div did not contain a checkbox")
        return false
      }
    }
    let second_buttons = document.getElementById(animation_div_id).getElementsByClassName("play-button  bounce");
    let pause_buttons_present = false;
    let possible_pause_buttons = document.getElementById(animation_div_id).getElementsByClassName("zb-button  grey             normalize-controls")
    for (let i = 0; i < possible_pause_buttons.length; i++) {
      if(possible_pause_buttons.item(i).getAttribute("aria-label") === "Pause"){
        pause_buttons_present = true;
      }
    }
    if(second_buttons.length === 0 && animations.length === 0 && !pause_buttons_present) {
      return true
    }
    for (let i = 0; i < animations.length; i++) {
      // console.log(animations.item(i));
      animations.item(i).click();
    }
    for (let i = 0; i < second_buttons.length; i++) {
      // console.log(second_buttons.item(i));
      second_buttons.item(i).click();
    }
  }

}

function short_answer_tick(){
  let change = false
  let short_answer_divs = document.getElementsByClassName("question-set-question short-answer-question ember-view")
  if(short_answer_divs.length === 0){
    return false;
  }
  // console.log("short_answer_divs");
  // console.log(short_answer_divs);
  for (let i = 0; i < short_answer_divs.length; i++) {
    // console.log("short answer box:")
    // console.log(short_answer_divs.item(i));
    if(short_answer_divs.item(i).getElementsByClassName("zb-explanation has-explanation correct").length === 0)
    {
      change = true;
      let forfeit_answers = short_answer_divs.item(i).getElementsByClassName("forfeit-answer ");
      let show_a_buttons = short_answer_divs.item(i).getElementsByClassName("zb-button  secondary             show-answer-button");
      if (forfeit_answers.length === 0){
        for (let i = 0; i < show_a_buttons.length; i++) {
          // console.log(show_a_buttons.item(i));
          show_a_buttons.item(i).click();
          show_a_buttons.item(i).click();
        }
      } else {
        let answer = forfeit_answers.item(0).textContent
        // console.log(answer)
        let text_boxes = short_answer_divs.item(i).getElementsByClassName("ember-text-area ember-view zb-text-area hide-scrollbar")
        if(text_boxes.length === 0){
          console.error("NO TEXT INPUT FIELD FOUND");
        } else {
          text_boxes.item(0).value = answer.trim();
          text_boxes.item(0).dispatchEvent(e);
          let check_buttons = short_answer_divs.item(i).getElementsByClassName("zb-button  primary  raised           check-button")
          if(check_buttons.length === 0){
            console.error("NO CHECK BUTTONS FOUND");
          } else {
            check_buttons.item(0).click();
          }
        }

      }
    }
  }
  return change;
}

function mcq_tick(){
  let mc_questions = document.getElementsByClassName("question-set-question multiple-choice-question ember-view")
  if(mc_questions.length === 0){
    console.log("no multiple choice questions exist")
    return false;
  } else {
    for (let i = 0; i < mc_questions.length; i++) {
      let mc_q_id = mc_questions.item(i).id;
      let correct_answer_divs = mc_questions.item(i).getElementsByClassName("zb-explanation has-explanation correct")
      if(correct_answer_divs.length === 0) {
        // console.log(mc_q_id)

        solve_mcq(mc_q_id)
      }
    }
  }
  return false
}

async function solve_mcq(mc_id){
  // console.log("solving mcq id " + mc_id)
  let input_divs = document.getElementById(mc_id).getElementsByClassName("zb-radio-button   orange   ")
  const num_answers = input_divs.length
  // console.log("num_answers: " + num_answers)
  let correct_answer_divs;
  if (num_answers === 0) {
    console.error("No multiple choice options found");
  } else {
    for (let i = 0; i < num_answers; i++) {
      // console.log("checking option " + i + ". (index starts at 0)")
      input_divs.item(i).getElementsByTagName("input")
      let input_items = input_divs.item(i).getElementsByTagName("input")
      if (!(input_items.length === 1)) {
        console.error("no input tag found in mcq answer div")
      } else {
        input_items.item(0).click();
        await sleep(1000);
        correct_answer_divs = document.getElementById(mc_id).getElementsByClassName("zb-explanation has-explanation correct")
        // console.log("correct_answer_divs: ")
        // console.log(correct_answer_divs)
        if (correct_answer_divs.length === 1) {
          break;
        }
      }
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}