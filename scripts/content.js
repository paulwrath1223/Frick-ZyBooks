
const e = new Event("change");

class problem_solver{
  constructor(problem_type_string, div_class_name, click_event_handler, locator_function) {
    this.div_class_name = div_class_name;
    this.click_event_handler = click_event_handler;
    this.locator_function = locator_function;
    this.problem_type_string = problem_type_string;
  }
}

const problem_solvers = [
    new problem_solver("animation", "interactive-activity-container animation-player-content-resource participation large ember-view", animation_div_click_event_handler, get_animation_div_ids),
    new problem_solver("mcq", "interactive-activity-container multiple-choice-content-resource participation large ember-view", mcq_div_click_event_handler, get_mcq_div_ids),
    new problem_solver("short_answer", "interactive-activity-container short-answer-content-resource participation large ember-view", short_answer_div_click_event_handler, get_short_answer_div_ids),
    new problem_solver("drag_and_drop", "interactive-activity-container custom-content-resource participation large ember-view", drag_and_drop_div_click_event_handler, get_drag_and_drop_div_ids),
    new problem_solver("enter_output", "interactive-activity-container custom-content-resource challenge large ember-view", enter_output_div_click_event_handler, get_enter_output_div_ids),
]

setInterval(function() {
  attach_button_event_listeners();
  remove_watermarks();
}, 200);

function remove_watermarks(){
  const watermark_DOMs = document.getElementsByClassName("activity-watermark");
  for(let i = 0; i < watermark_DOMs.length; i ++){
    watermark_DOMs.item(i).textContent = "foiled again";
  }
}

function attach_button_event_listeners(){
  let current_div_ids = [];
  let current_div_id

  const add_class_to_linked_DOMs = function(current_root_div, class_name, problem_object, problem_number){
    const button_divs = document.getElementById(current_root_div).getElementsByClassName(class_name);

    for (let k = 0; k < button_divs.length; k++) {

      const button_div_id = ("FZYB_" + (problem_object.problem_type_string) + "_" + problem_number);
      if (!(button_divs.item(k).id === button_div_id)) {
        button_divs.item(k).id = button_div_id;
        document.getElementById(button_div_id).style.cursor = "pointer";
        const copy_of_current_div_id = current_root_div; // probably needed to avoid events calling function with reference of new variable
        document.getElementById(button_div_id).addEventListener('mouseup', (event) => {
          problem_object.click_event_handler(event, copy_of_current_div_id);
        });
      }

    }
  }

  for (let i = 0; i < problem_solvers.length; i++) {
    current_div_ids = problem_solvers[i].locator_function();
    for (let j = 0; j < current_div_ids.length; j++) {
      current_div_id = current_div_ids[j];
      add_class_to_linked_DOMs(current_div_id, "zb-chevron check title-bar-chevron orange  filled  large", problem_solvers[i], j);
      add_class_to_linked_DOMs(current_div_id, "zb-chevron check title-bar-chevron blue  filled  large", problem_solvers[i], j);
      add_class_to_linked_DOMs(current_div_id, "zb-chevron  title-bar-chevron grey   chevron-outline large", problem_solvers[i], j);
    }
  }
}

function get_drag_and_drop_div_ids(){
  return(get_DOM_ids_from_class_name("interactive-activity-container custom-content-resource participation large ember-view")); // TODO: this class name is not specific to drag and drop questions
}

async function enter_output_div_click_event_handler(event, enter_output_div_id){
  let experienced_error = false;
  let code_output = "";

  const continue_loop = function (root_section_div_id){
    const done_DOMs = document.getElementById(root_section_div_id).getElementsByClassName("zyante-progression-is-done correct");
    return !((done_DOMs.length === 1) && done_DOMs.item(0).style.display === "");

  }

  const check_correctness = async function (root_section_div_id) {
    let timed_out = false;

    const timeoutID = setTimeout(() => {
      timed_out = true;
    }, 1000);

    let check_DOM = document.getElementById(root_section_div_id).getElementsByClassName("zyante-progression-checkmark");
    let x_mark_DOM = document.getElementById(root_section_div_id).getElementsByClassName("zyante-progression-x-mark");

    let correct = ((check_DOM.length === 1) && check_DOM.item(0).style.display === "")
    let incorrect = ((x_mark_DOM.length === 1) && x_mark_DOM.item(0).style.display === "")
    while (!(correct || incorrect || timed_out)) {
      check_DOM = document.getElementById(root_section_div_id).getElementsByClassName("zyante-progression-checkmark");
      x_mark_DOM = document.getElementById(root_section_div_id).getElementsByClassName("zyante-progression-x-mark");
      correct = ((check_DOM.length === 1) && check_DOM.item(0).style.display === "")
      incorrect = ((x_mark_DOM.length === 1) && x_mark_DOM.item(0).style.display === "")
      await sleep(100);
    }
    clearTimeout(timeoutID);
    return !incorrect;

  }

  set_title(enter_output_div_id, "Working...");
  let start_button_DOMs = document.getElementById(enter_output_div_id).getElementsByClassName("zyante-progression-start-button button");
  if(start_button_DOMs.length > 0){
    start_button_DOMs.item(0).click()
  }
  await sleep(200);

  while(continue_loop(enter_output_div_id) && !experienced_error){
    await sleep(200);
    let code_DOMs = document.getElementById(enter_output_div_id).getElementsByClassName("code");
    let code_plain_text = "";
    if(!(code_DOMs.length === 1)) {
      set_title(enter_output_div_id, "Error: no code found");
      experienced_error = true;
      break;
    }
    code_plain_text = code_DOMs.item(0).innerText;
    code_output = await compile_cpp(code_plain_text)
    if(code_output === undefined){
      experienced_error = true;
      set_title(enter_output_div_id, "Error: API did not produce an output");
      break;
    }
    let input_DOMs = document.getElementById(enter_output_div_id).getElementsByClassName("console");
    if(!(input_DOMs.length === 1)) {
      set_title(enter_output_div_id, "Error: no text area found");
      experienced_error = true;
      break;
    }
    input_DOMs.item(0).value = code_output.replace("\\n", "\n");
    input_DOMs.item(0).dispatchEvent(e);
    const check_output_DOMs = document.getElementById(enter_output_div_id).getElementsByClassName("zyante-progression-check-button button");
    if(!(check_output_DOMs.length === 1)) {
      set_title(enter_output_div_id, "Error: No \'check\' button found");
      experienced_error = true;
    }
    check_output_DOMs.item(0).click();
    if(!await check_correctness(enter_output_div_id))
    {
      set_title(enter_output_div_id, "Error: Incorrect answer or timed out waiting for feedback");
      experienced_error = true;
    }
    await sleep(100);
    const next_DOMs = document.getElementById(enter_output_div_id).getElementsByClassName("zyante-progression-next-button button");
    if(!(next_DOMs.length === 1)) {
      set_title(enter_output_div_id, "Error: No \'next\' button found");
      experienced_error = true;
      break;
    }
    next_DOMs.item(0).click()
  }
  if(!continue_loop(enter_output_div_id)){
    set_title(enter_output_div_id, "Done");
  }
}

async function drag_and_drop_div_click_event_handler(event, drag_and_drop_div_id){
  set_title(drag_and_drop_div_id, "Drag and drop problems not yet implemented");
}

function get_enter_output_div_ids(){
  let real_enter_output_div_ids = [];
  const potential_enter_output_div_ids = get_DOM_ids_from_class_name("interactive-activity-container custom-content-resource challenge large ember-view");
  const num_potential_enter_output_div_ids = potential_enter_output_div_ids.length
  if(num_potential_enter_output_div_ids === 0){
    return real_enter_output_div_ids;
  }
  for(let i = 0; i < num_potential_enter_output_div_ids; i++){
    if((document.getElementById(potential_enter_output_div_ids[i]).getElementsByClassName("custom-tool codeOutput progressionTool").length) === 1){
      real_enter_output_div_ids.push(potential_enter_output_div_ids[i]);
    }
  }
  return real_enter_output_div_ids;
}

function get_animation_div_ids(){
  return(get_DOM_ids_from_class_name("interactive-activity-container animation-player-content-resource participation large ember-view"))
}

async function animation_div_click_event_handler(event, animation_div_id) {
  set_title(animation_div_id, "Processing...");
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
        set_title(animation_div_id, "Error");
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
      set_title(animation_div_id, "Done");
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
    await sleep(200);
  }

}

function get_short_answer_div_ids(){
  return(get_DOM_ids_from_class_name("interactive-activity-container short-answer-content-resource participation large ember-view"));
}

async function short_answer_div_click_event_handler(event, short_answer_div_id){
  set_title(short_answer_div_id, "Processing...");
  let completed_short_answers = 0;
  let failure = false;
  let short_answer_divs;
  short_answer_divs = document.getElementById(short_answer_div_id).getElementsByClassName("question-set-question short-answer-question ember-view");
  const num_short_answers = short_answer_divs.length;
  for (let i = 0; i < num_short_answers; i++) {
    solve_individual_short_answer_problem_by_id(short_answer_divs.item(i).id).then((success) => {
      completed_short_answers += 1;
      if(!success){
        failure = true;
      }
    });
  }
  while(!(completed_short_answers === num_short_answers)){
    await sleep(10);
  }
  if(failure){
    set_title(short_answer_div_id, "Error");
  } else {
    set_title(short_answer_div_id, "Done");
  }
}

async function solve_individual_short_answer_problem_by_id(short_answer_problem_id){
  let individual_short_answer = document.getElementById(short_answer_problem_id);

  while(individual_short_answer.getElementsByClassName("zb-explanation has-explanation correct").length === 0)
  {
    let forfeit_answers = individual_short_answer.getElementsByClassName("forfeit-answer ");
    let show_a_buttons = individual_short_answer.getElementsByClassName("zb-button  secondary             show-answer-button");
    if (forfeit_answers.length === 0){
      for (let i = 0; i < show_a_buttons.length; i++) {
        // console.log(show_a_buttons.item(i));
        show_a_buttons.item(i).click();
        show_a_buttons.item(i).click();
      }
    } else {
      let answer = forfeit_answers.item(0).textContent;
      // console.log(answer)
      let text_boxes = individual_short_answer.getElementsByClassName("ember-text-area ember-view zb-text-area hide-scrollbar")
      if(text_boxes.length === 0){
        console.error("NO TEXT INPUT FIELD FOUND");
        return false;
      } else {
        text_boxes.item(0).value = answer.trim();
        text_boxes.item(0).dispatchEvent(e);
        let check_buttons = individual_short_answer.getElementsByClassName("zb-button  primary  raised           check-button")
        if(check_buttons.length === 0){
          console.error("NO CHECK BUTTONS FOUND");
          return false;
        } else {
          check_buttons.item(0).click();
        }
      }

    }
    individual_short_answer = document.getElementById(short_answer_problem_id)
    await sleep(1000)
  }
  return true;
}

function get_mcq_div_ids(){
  return(get_DOM_ids_from_class_name("interactive-activity-container multiple-choice-content-resource participation large ember-view"));
}

async function mcq_div_click_event_handler(event, mcq_div_id){
  set_title(mcq_div_id, "Processing...");
  let num_solved = 0;
  let mc_questions = document.getElementById(mcq_div_id).getElementsByClassName("question-set-question multiple-choice-question ember-view")
  let correct_answer_divs;
  let mcq_id;
  let failure = false;
  const num_problems = mc_questions.length;
  for (let i = 0; i < num_problems; i++) {
    mcq_id = mc_questions.item(i).id;
    correct_answer_divs = mc_questions.item(i).getElementsByClassName("zb-explanation has-explanation correct")
    if(correct_answer_divs.length === 0) {
      // console.log(mc_q_id)
      solve_mcq(mcq_id).then((success) => {
        num_solved += 1;
        if (!success) {
          failure = true;
        }
      })
    }
  }
  while(!(num_solved === num_problems)){
    await sleep(10);
  }
  if(failure){
    set_title(mcq_div_id, "Error");
  } else {
    set_title(mcq_div_id, "Done");
  }
}

async function solve_mcq(mcq_id){
  // console.log("solving mcq id " + mcq_id)
  let input_divs = document.getElementById(mcq_id).getElementsByClassName("zb-radio-button   orange   ")
  const num_answers = input_divs.length
  // console.log("num_answers: " + num_answers)
  let correct_answer_divs;
  let input_items;
  if (num_answers === 0) {
    console.error("No multiple choice options found");
  } else {
    for (let i = 0; i < num_answers; i++) {
      // console.log("checking option " + i + ". (index starts at 0)")
      input_items = input_divs.item(i).getElementsByTagName("input")
      if (!(input_items.length === 1)) {
        console.error("0 or more than 1 input tag found in mcq answer div")
      } else {
        input_items.item(0).click();
        await sleep(1000);
        correct_answer_divs = document.getElementById(mcq_id).getElementsByClassName("zb-explanation has-explanation correct")
        // console.log("correct_answer_divs: ")
        // console.log(correct_answer_divs)
        if (correct_answer_divs.length === 1) {
          return true;
        }
      }
    }
  }
  return false;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function get_DOM_ids_from_class_name(class_name){
  let id_array = [];
  let matching_elements = document.getElementsByClassName(class_name);
  for (let i = 0; i < matching_elements.length; i++) {
    id_array.push(matching_elements.item(i).id);
  }
  return id_array;
}

function set_title(div_id, new_title){
  const title_DOMS = document.getElementById(div_id).getElementsByClassName("activity-title")
  if(!(title_DOMS.length === 1)){
    console.error("section div has 0 or more than 1 title");
  } else {
    title_DOMS.item(0).innerText = new_title;
  }
}

async function compile_cpp(code_string) {
  let timed_out = false;
  const timeoutID = setTimeout(() => {
    timed_out = true;
  }, 10000);
  let response_output = ""; // this value is used if the API request times out
  let response_received = false;
  const data = JSON.stringify({
    language: 'cpp17',
    version: 'latest',
    code: code_string,
    input: null
  });
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener('readystatechange', function () {
    if (this.readyState === this.DONE) {
      const response_json = JSON.parse(this.responseText);
      response_output = response_json.output;
      response_received = true;
    }
  });
  xhr.open('POST', 'https://online-code-compiler.p.rapidapi.com/v1/');
  xhr.setRequestHeader('content-type', 'application/json');
  xhr.setRequestHeader('X-RapidAPI-Key', '591f261ff4msh26f3f44db0aa77bp1c5c8fjsn002736b5e301');
  xhr.setRequestHeader('X-RapidAPI-Host', 'online-code-compiler.p.rapidapi.com');
  xhr.send(data);
  while (!(response_received || timed_out)) {
    await sleep(10);
  }
  clearTimeout(timeoutID);
  return response_output;
}
