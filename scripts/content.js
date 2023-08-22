// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.






const e = new Event("change");

let still_working = true;
let loading_stage = true;
let done_with_stupid_problems = false;
let currentUrl = location.href;


//
setInterval(function() {
  if(!(currentUrl === location.href)){
    still_working = true;
    loading_stage = true;
    done_with_stupid_problems = false;
    currentUrl = location.href;
  }
  if(loading_stage){
    loading_stage = (document.getElementsByClassName("section-announcement zb-card primary assignment-section-announcement").length === 0);
  } else {
    if(still_working){
      tick_handler();
    } else {
      if(!done_with_stupid_problems){
        alert("Removed stupid ass problems");
        done_with_stupid_problems = true;
      }
    }
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



function animation_tick() {
  let animations = document.getElementsByClassName("zb-button  primary  raised           start-button start-graphic");
  let speed_check_box_divs = document.getElementsByClassName("zb-checkbox   grey label-present right")
  for (let i = 0; i < speed_check_box_divs.length; i++) {
    let input_element = speed_check_box_divs.item(i).getElementsByTagName("input")
    if(input_element.length === 1) {
      if(input_element.item(0).checked === false){
        input_element.item(0).click();
      }
      input_element.item(0).dispatchEvent(e);
    } else {
      console.error("Checkbox div did not contain a checkbox")
    }
  }
  let second_buttons = document.getElementsByClassName("play-button  bounce");


  // <button aria-label="Pause" class="zb-button  grey             normalize-controls" aria-live="polite" type="button">
  //
  //                     <div aria-hidden="true" class="pause-button  ">
  //                     </div>
  //
  // </button>
  let pause_buttons_present = false;
  let possible_pause_buttons = document.getElementsByClassName("zb-button  grey             normalize-controls")
  for (let i = 0; i < possible_pause_buttons.length; i++) {
    if(possible_pause_buttons.item(i).getAttribute("aria-label") === "Pause"){
      // console.log("pause button found: ");
      // console.log(possible_pause_buttons.item(i));
      pause_buttons_present = true;
    }
  }
  if(second_buttons.length === 0 && animations.length === 0 && !pause_buttons_present){
    // console.log("animation_tick returns false")
    return false;
  // } else {
  //   console.log("animation_tick returns true");
  //   console.log("pause_buttons_present: " + pause_buttons_present);
  //   console.log("second_buttons.length === 0: " + (second_buttons.length === 0));
  //   console.log("second_buttons: ");
  //   console.log(second_buttons);
  //   console.log("animations.length === 0: " + (animations.length === 0));
  //
  }

  for (let i = 0; i < animations.length; i++) {
    // console.log(animations.item(i));
    animations.item(i).click();
  }


  for (let i = 0; i < second_buttons.length; i++) {
    // console.log(second_buttons.item(i));
    second_buttons.item(i).click();
  }
  return true;
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