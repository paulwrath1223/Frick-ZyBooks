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


let animations
let second_buttons
let show_a_buttons
let short_answer_divs
const e = new Event("change");


console.log("fortnite balls");

const interval = setInterval(function() {
  animation_tick()
  // short_answer_tick()
  // mcq_tick()
}, 5000);

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

function animation_tick() {
  animations = document.getElementsByClassName("zb-button  primary  raised           start-button start-graphic");
  let speed_check_box_divs = document.getElementsByClassName("zb-checkbox   grey label-present right")
  for (let i = 0; i < speed_check_box_divs.length; i++) {
    let input_element = speed_check_box_divs.item(i).getElementsByTagName("input")
    if(input_element.length === 1) { // TODO Fix
      console.log(input_element.item(0));
      console.log("value of check box")
      console.log(input_element.item(0).checked)
    } else {
      console.log("Checkbox div did not contain a checkbox")
    }
  }


  for (let i = 0; i < animations.length; i++) {
    console.log(animations.item(i));
    animations.item(i).click();
  }
  second_buttons = document.getElementsByClassName("play-button  bounce");

  for (let i = 0; i < second_buttons.length; i++) {
    console.log(second_buttons.item(i));
    second_buttons.item(i).click();
  }
}

function short_answer_tick(){
  short_answer_divs = document.getElementsByClassName("question-set-question short-answer-question ember-view")
  console.log("short_answer_divs");
  console.log(short_answer_divs);
  for (let i = 0; i < short_answer_divs.length; i++) {
    console.log("short answer box:")
    console.log(short_answer_divs.item(i));
    let forfeit_answers = short_answer_divs.item(i).getElementsByClassName("forfeit-answer ")
    show_a_buttons = short_answer_divs.item(i).getElementsByClassName("zb-button  secondary             show-answer-button");
    if (forfeit_answers.length === 0){
      for (let i = 0; i < show_a_buttons.length; i++) {
        console.log(show_a_buttons.item(i));
        show_a_buttons.item(i).click();
        show_a_buttons.item(i).click();
      }
    } else {
      let answer = forfeit_answers.item(0).textContent
      console.log(answer)
      let text_boxes = short_answer_divs.item(i).getElementsByClassName("ember-text-area ember-view zb-text-area hide-scrollbar")
      if(text_boxes.length === 0){
        console.error("NO TEXT INPUT FIELD FOUND")
      } else {
        text_boxes.item(0).value = answer.trim()
        text_boxes.item(0).dispatchEvent(e);
        let check_buttons = short_answer_divs.item(i).getElementsByClassName("zb-button  primary  raised           check-button")
        if(check_buttons.length === 0){
          console.error("NO CHECK BUTTONS FOUND")
        } else {
          check_buttons.item(0).click()
        }
      }

    }

  }
}

function mcq_tick(){
  let mc_questions = document.getElementsByClassName("question-set-question multiple-choice-question ember-view")
  if(mc_questions.length === 0){
    console.log("no multiple choice questions exist")
  } else {
    for (let i = 0; i < mc_questions.length; i++) {
      let mc_q_id = mc_questions.item(i).id;
      console.log(mc_q_id)
      solve_mcq(mc_q_id)
    }
  }
}

async function solve_mcq(mc_id){
  let correct_answer_divs = document.getElementById(mc_id).getElementsByClassName("zb-explanation has-explanation correct")
  if(correct_answer_divs.length === 0){
    console.log("solving mcq id " + mc_id)
    let input_divs = document.getElementById(mc_id).getElementsByClassName("zb-radio-button   orange   ")
    const num_answers = input_divs.length
    console.log("num_answers: " + num_answers)
    if(num_answers === 0){
      console.error("No multiple choice options found")
    } else {
      for (let i = 0; i < num_answers; i++){
        console.log("checking option " + i + ". (index starts at 0)")
        input_divs.item(i).getElementsByTagName("input")
        let input_items = input_divs.item(i).getElementsByTagName("input")
        if(!(input_items.length === 1)){
          console.error("no input tag found in mcq answer div")
        } else {
          input_items.item(0).click()
          await sleep(2000)
          correct_answer_divs = document.getElementById(mc_id).getElementsByClassName("zb-explanation has-explanation correct")
          console.log("correct_answer_divs: ")
          console.log(correct_answer_divs)
          if(correct_answer_divs.length === 1){
            break
          }
        }
      }
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}