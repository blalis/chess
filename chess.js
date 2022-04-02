// vars declarations
let dim = 8;
let board = new Array(dim).fill(null).map(()=>new Array(dim).fill(null));
let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
//let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
//let html_chess = { "WK" : "&#9812", "WQ" : "&#9813", "WR" : "&#9814", "WB" : "&#9815", "WN" : "&#9816", "WP" : "&#9817", "BK" : "&#9818", "BQ" : "&#9819", "BR" : "&#9820", "BB" : "&#9821", "BN" : "&#9822", "BP" : "&#9823" };
let figures = ['R','N','B','Q','K','B','N','R'];
let moves = [];
let game_with_computer = 0;
let computer_player = 'B';
let computer_player_in_next_game = 'B';
let computer_difficulty_level=0;
let computer_move_function = 0;
let player = 'W';
let clicked_field;
let clicked_field_value;
let clicked_field_id;
let field_color;
let click = 0;
let is_game_on = 0;
let is_game_finished = 0;
let pawn_promotion_check = 0;
let pawn_promotion_piece;
let current_move_piece;
let current_move_from;
let current_move_to;
let medieval_moves = 1;
let castling = 1;
let en_passant = 1;
let showing_possible_moves = 0;
let lighting_check = 0;
let lighting_final_result_pieces = 0;
let check_if_king_moved = { "W":0,"B":0 };
let check_if_first_rook_moved = { "W":0,"B":0 };
let check_if_second_rook_moved = { "W":0,"B":0 };
let flip_view = 'W';
let auto_flip_view = 1;
let drag_piece;
let field_sign_color = 'gold';
let possible_move_show_color = 'dodgerblue';
let check_show_color = 'red';
let arrow_control_switch = 0;
let arrow_last_white_position;
let arrow_last_black_position;
let arrow_current_position = 'A1';
let arrow_current_position_color = 'green';
let arrow_current_position_previous_color;
let square_side;
let pawn_promotion_field_image_size;
let current_move_change = 0;
let current_move_global;
let allow_color_change_during_game = 1;

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

window.addEventListener('resize', function(event){
  set_board_dimensions();
});
window.addEventListener("keydown", keycontrol);

// FUNCTIONS triggered on page load !!!
new_game();
set_board_dimensions();
training();

// FUNCTIONS to build

function training(){
  game_with_computer = 0;
  change_css_for_class('options-menu-buttons', 'options-menu-buttons');
  //document.getElementById("training_button").className = "options-menu-buttons_active";
  document.getElementById("training_button").classList.add("options-menu-buttons_active");
}

function change_css_for_class(shared_class, class_to_set){
  let list = document.getElementsByClassName(shared_class);
  for(let el of list){
    el.className = class_to_set;
  }
}

function play_against_computer_button(id, with_training){
  game_with_computer = 1;
  if(computer_player == 'W')
    play_as_checkbox('black');
  else
    play_as_checkbox('white');
  //computer_difficulty_level=0;
  if( player == computer_player){
    computer_move();
  }
  if( with_training == 1 )
    allow_color_change_during_game = 1;
  else
    allow_color_change_during_game = 0;
  change_css_for_class('options-menu-buttons', 'options-menu-buttons');
  document.getElementById(id).classList.add("options-menu-buttons_active");
}

function computer_move(){
  let moves=[];
  let random_move;
  let moving_piece_field;
  let moving_piece_target;
  let computer_player;
  let piece_position;
  let king_field;
  let temp_field_x_1, temp_field_x_2, temp_field_y_1, temp_field_y_2;
  //computer_player=opposite_player(player);
  computer_player=player;
  computer_move_function = 1;
  //moves=get_all_possible_moves_for_player( board,opposite_player(player) );
  moves=get_all_possible_moves_for_player( board,computer_player );
  if( moves.length == 0 )
    return 1;
  if( check_if_king_is_checked( computer_player,board ) == 1 ){
    piece_position=find_piece_on_board( board,computer_player+'K' );
    king_field = get_field_name_from_board(piece_position['x'],piece_position['y']);
    //moves=check_possible_moves_for_king( board,piece_position['x'],piece_position['y'] );
    moves = show_all_moves_to_prevent_check(board);
    if( moves.length == 0 ){
      return 1;
    }
  }
  do{
    random_move=Math.floor( Math.random()*moves.length );
    //console.log(moves[random_move]+"   "+random_move);
    random_move=moves[random_move];
    random_move=Math.floor( Math.random()*moves.length );
    //console.log(moves[random_move]+"   "+random_move);
    random_move=moves[random_move];
    moving_piece_field=random_move.substring(0,2);
    moving_piece_target=random_move.substring(3,5);
    temp_field_x_1 = get_board_index(moving_piece_field);
    temp_field_y_1 = temp_field_x_1['y'];
    temp_field_x_1 = temp_field_x_1['x'];
    temp_field_x_2 = get_board_index(moving_piece_target);
    temp_field_y_2 = temp_field_x_2['y'];
    temp_field_x_2 = temp_field_x_2['x'];
  } while( check_move_possibility(board[temp_field_y_1][temp_field_x_1],'',moving_piece_field,moving_piece_target) == 0 );
  //} while( check_if_king_will_be_checked_after_move( computer_player,temp_field_x_1,temp_field_y_1,temp_field_x_2,temp_field_y_2,1 ) != 0 );
/*
  console.log(moving_piece_field);
  console.log(moving_piece_target);
  console.log(random_move);
*/
  //console.log("START: "+moving_piece_field+":"+moving_piece_target);

  click_chessfield(moving_piece_field,get_field_value( board,moving_piece_field ));
  click_chessfield(moving_piece_target,get_field_value( board,moving_piece_target ) )
  //console.log("END: "+moving_piece_field+":"+moving_piece_target);
  computer_move_function = 0;
  return 0;
}

function show_all_moves_to_prevent_check(chessboard){
  let checked_player;
  let king_field;
  let king_x, king_y;
  let checking_field_x, checking_field_y;
  let temp_field_x_1, temp_field_x_2, temp_field_y_1, temp_field_y_2;
  let moves = [];
  let move;
  //let king_possible_moves = [];
  checked_player = get_checked_player(chessboard);
  if( checked_player == 0 )
    return moves;
  king_field = get_king_field(chessboard, checked_player);
  king_x =  get_board_index( king_field );
  king_y = king_x['y'];
  king_x = king_x['x'];
  //king_possible_moves = check_possible_moves_for_king(chessboard,king_x,king_y);
  for(move of check_possible_moves_for_king(chessboard,king_x,king_y)){
    moves.push(king_field+':'+move);
  }
  attacking_fields = get_fields_of_pieces_attacking_field( chessboard,king_field,by_player='' );
  if( attacking_fields.length > 1 ){
    return moves;
  }
  checking_field_x = get_board_index(attacking_fields[0]);
  checking_field_y = checking_field_x['y'];
  checking_field_x = checking_field_x['x'];
  for(move of get_fields_of_pieces_attacking_field( chessboard,attacking_fields[0],by_player='' )){
    /*
    field_x = get_field_x_index(move);
    field_y = get_field_y_index(move);
    */
    temp_field_x_1 = get_board_index(move);
    temp_field_y_1 = temp_field_x_1['y'];
    temp_field_x_1 = temp_field_x_1['x'];
    if( check_if_king_will_be_checked_after_move( checked_player,temp_field_x_1,temp_field_y_1,checking_field_x,checking_field_y,1 ) == 0 )
      moves.push(move+':'+attacking_fields[0]);
  }
  for(move of show_fields_between_piece_and_destination(chessboard,king_x,king_y,checking_field_x,checking_field_y)){
    for(let field of show_pieces_which_can_access_field(chessboard,move,checked_player)){
      temp_field_x_1 = get_board_index(field);
      temp_field_y_1 = temp_field_x_1['y'];
      temp_field_x_1 = temp_field_x_1['x'];
      temp_field_x_2 = get_board_index(move);
      temp_field_y_2 = temp_field_x_2['y'];
      temp_field_x_2 = temp_field_x_2['x'];
      if( check_if_king_will_be_checked_after_move( checked_player,temp_field_x_1,temp_field_y_1,temp_field_x_2,temp_field_y_2,1 ) == 0 )
        moves.push(field+':'+move);
    }
  }
  //check_if_it_is_possible_to_block_check(chessboard,checked_player,oldx,oldy,newx,newy);
  return moves;
}

function get_checked_player(chessboard){
  checked_player = 0;
  if( check_if_king_is_checked('W',chessboard) ){
    checked_player = 'W';
  }
  if( check_if_king_is_checked('B',chessboard) ){
    checked_player = 'B';
  }
  return checked_player;
}

function get_king_field(chessboard, player){
  let x,y;
  for(y=0;y<dim;y++){
    for(x=0;x<dim;x++){
      if( chessboard[y][x] == player+'K')
        return get_field_name_from_board(x,y);
    }
  }
}

function play_as_checkbox(color){
  let checkboxes=document.getElementsByClassName("play-as-checkbox");
  let color_checkbox;
  let current_player = player;
  for( elem of checkboxes ){
    if( elem.id == "play-as-"+color+"-checkbox" )
      color_checkbox=document.getElementById("play-as-"+color+"-checkbox");
    elem.checked=false;
  }
  color_checkbox.checked=true;
  if( color == 'white' ){
    computer_player_in_next_game='B';
  }
  if( color == 'black' ){
    computer_player_in_next_game='W';
  }

  if( allow_color_change_during_game == 0 ){
    return 0;
  }

  computer_player = computer_player_in_next_game;
  if( game_with_computer == 1 && player == computer_player )
    computer_move();
}

function set_difficulty_level(level){
  let checkboxes=document.getElementsByClassName("difficulty-level-checkbox");
  let level_checkbox;
  for( elem of checkboxes ){
    if( elem.id == "difficulty-level-"+level+"-checkbox" )
      level_checkbox=document.getElementById("difficulty-level-"+level+"-checkbox");
    elem.checked=false;
  }
  computer_difficulty_level=level;
  level_checkbox.checked=true;
}

function get_all_possible_moves_for_player( chessboard,player_to_move ){
  let moves = [];
  let piece_moves = [];
  let x,y,field;
  for( y=0;y<dim;y++ ){
    for( x=0;x<dim;x++ ){
      if( chessboard[y][x][0] == player_to_move ){
      	switch( chessboard[y][x][1] ) {
      		case 'P':
      			piece_moves=check_possible_moves_for_pawn( chessboard,x,y );
      			break;
      		case 'R':
      			piece_moves=check_possible_moves_for_rook( chessboard,x,y );
      			break;
      		case 'N':
      			piece_moves=check_possible_moves_for_knight( chessboard,x,y );
      			break;
      		case 'B':
      			piece_moves=check_possible_moves_for_bishop( chessboard,x,y );
      			break;
      		case 'Q':
      			piece_moves=check_possible_moves_for_queen( chessboard,x,y );
      			break;
      		case 'K':
      			piece_moves=check_possible_moves_for_king( chessboard,x,y );
      			break;
      	}
        for( move of piece_moves ){
          field=get_field_name_from_board( x,y );
          moves.push( field+':'+move );
        }
        //console.log(moves);
      }
    }
  }
  //console.log(moves);
  return moves;
}

function get_all_possible_moves( chessboard ){
  let moves = [];
  let piece_moves = [];
  let x,y,field;
  for( y=0;y<dim;y++ ){
    for( x=0;x<dim;x++ ){
      if( chessboard[y][x] != '' ){
      	switch( chessboard[y][x][1] ) {
      		case 'P':
      			piece_moves=check_possible_moves_for_pawn( chessboard,x,y );
      			break;
      		case 'R':
      			piece_moves=check_possible_moves_for_rook( chessboard,x,y );
      			break;
      		case 'N':
      			piece_moves=check_possible_moves_for_knight( chessboard,x,y );
      			break;
      		case 'B':
      			piece_moves=check_possible_moves_for_bishop( chessboard,x,y );
      			break;
      		case 'Q':
      			piece_moves=check_possible_moves_for_queen( chessboard,x,y );
      			break;
      		case 'K':
      			piece_moves=check_possible_moves_for_king( chessboard,x,y );
      			break;
      	}
        for( move of piece_moves ){
          field=get_field_name_from_board( x,y );
          moves.push( field+':'+move );
        }
        //console.log(moves);
      }
    }
  }
  //console.log(moves);
  return moves;
}

function check_game_result_for_both_sides( chessboard ){
// napisać funkcję do weryfikacji wyniku dla ONYDWU STRON !!!
// alternatywa do function check_game_result()
}
function check_if_king_can_escape( chessboard,player ){
  let king_index;
  let kingx,kingy;
  let x,y,field;
  let opponent = opposite_player( player );
  king_index=find_piece_on_board( chessboard,player+'K' );
  kingx=king_index['x'];
  kingy=king_index['y'];
  for( y=kingy-1;y<=kingy+1;y++ ){
    for( x=kingx-1;x<=kingx+1;x++ ){
      if( x == kingx  &&  y == kingy )
        continue;
      if( x < 0 || x >= dim || y < 0 || y >= dim )
        continue;
      field=get_field_name_from_board(x,y);
      if( chessboard[y][x][0] != player && field != 0 && check_if_field_is_attacked(chessboard,field,opponent) != 1 )
        return 1;
    }
  }
  return 0;
}

// Zastanowić się nad innymi
// symulacja gry
async function play_game( turn_time=1000 ) {
  let game_moves = ['E2','E4','E7','E6'];
  for( let i=0;i<game_moves.length;i++ ){
    document.getElementById(game_moves[i]).click();
    await new Promise(r => setTimeout(r, turn_time));
  }
}

// FUNCTIONS
function new_game(obj='') {
  let focused;
  if( obj != '' )
    focused = document.activeElement.id;
  reinitialize_vars();
  player = 'W';
	deploy_figures( board );
  computer_player = computer_player_in_next_game;
	generate_board();
  if( obj != '' && focused == obj.id )
    obj.blur();
}

function deploy_figures( chessboard ) {
  let x,y;
	for( x = 0 ; x < dim ; x++ ){
		chessboard[0][x] = 'B'+figures[x];
		chessboard[1][x] = 'B'+'P';
		for( y = 2 ; y < dim-2 ; y++){
			chessboard[y][x] = '';
		}
		chessboard[dim-2][x] = 'W'+'P';
		chessboard[dim-1][x] = 'W'+figures[x];
	}
}

function generate_board(){
	render_field_signs();
	render_chessboard();
  show_remaining_pieces();
  render_moves_history();
  if( game_with_computer == 1 && player == computer_player ){
    console.log("Computer move");
    computer_move();
  }
}

function render_chessboard() {
	let chessboard = document.getElementById("board");
	//chessboard.innerHTML = '';
	let content = '';
	let subcontent;
	let field_value;
	let color;
	let image;
	let result;
  let x,y;
	for( y = 0 ; y < dim ; y++ ){
		if( y % 2 == 0 )
			color = 'white';
		else
			color = 'black';
		for( x = 0 ; x < dim ; x++ ){
			if( board[y][x] != '' ){
				//field_value = html_chess[board[i][j]];
				image = 'image/'+board[y][x]+'_'+color+'_field.png';
        //if( board[y][x][0] == 'B' )
          image='image/'+board[y][x]+'.png';
			  subcontent = '<div id="'+letters[x]+( dim - y )+'" class="chessfield-'+color+'" onclick="click_chessfield(this.id,\''+board[y][x]+'\')" ondrop="dropf(event)" ondragover="allowDrop(event)"><img src="'+image+'" ondragstart="dragStart(event)" ondragend="dragEnd(event)" ondrop="dropf(event)" draggable="true"></img></div>';
			}
			else{
				field_value = '';
        //image = 'image/'+color+'.png';
			  subcontent = '<div id="'+letters[x]+( dim - y )+'" class="chessfield-'+color+'" onclick="click_chessfield(this.id,\''+board[y][x]+'\')" ondrop="dropf(event)" ondragover="allowDrop(event)">'+field_value+'</div>';
      }
			if( flip_view == 'W' )
				content=content+subcontent;
			else
				content=subcontent+content;
			if( color == 'white' )
				color = 'black';
			else
				color = 'white';
		}
	}
	chessboard.innerHTML = content;
  //render_moves_history();
	result = check_game_result( board );
	if( arrow_control_switch == 1 && result == 0 ){
		arrow_current_position_previous_color = '';
		if( player == 'W' )
			arrow_current_position = arrow_last_white_position;
		else if( player == 'B' )
			arrow_current_position = arrow_last_black_position;
		show_arrow_color_over_field();
	}
}

function render_field_signs(){
	let board_numbers = document.getElementById("numbers");
	let board_letters = document.getElementById("letters");
	let content_numbers = '';
	let content_letters = '';
	let subcontent_numbers;
	let subcontent_letters;
	for( let i = 0 ; i < dim ; i++ ){
		subcontent_numbers = '<div class="field-numbers" style="height:'+square_side+';width:'+parseInt(0.5*square_side)+';"><span>'+( dim-i )+'</span></div>';
		subcontent_letters = '<div class="field-letters"><span>'+letters[i]+'</span></div>';
		if( flip_view == 'W' ){
			content_numbers = content_numbers + subcontent_numbers;
			content_letters = content_letters + subcontent_letters;
		}
		else{
			content_numbers = subcontent_numbers + content_numbers;
			content_letters = subcontent_letters + content_letters;
		}
	}
	board_numbers.innerHTML = content_numbers;
	board_letters.innerHTML = content_letters;
}

// functions to drag/push figures instead of clicking or using arrows+enter

// drag bez imagu!!!
function dragStart(event){
  let field_id = event.target.parentNode.id;
  let figure = get_field_value(board,field_id);
  if( pawn_promotion_check > 0)
    return 0;
  setTimeout(function() {
    //event.target.style.display = "none";
//event.target.style.opacity=1;
  }, 0);
  if( field_id == clicked_field && click == 1 )
    return 0;
  click_chessfield(field_id,figure);
}

function allowDrop(event) {
  event.preventDefault();
}

function dropf(event) {
  let field_id = event.target.id;
  let figure;
  let result
  if( ! field_id  ){
    field_id = event.target.parentNode.id;
    if( field_id == clicked_field ){
      click = 0;
      clicked_field_id.style.backgroundColor = get_field_color(clicked_field);
      clear_possible_moves();
      return 0;
    }
    if( pawn_promotion_check > 0 )
      return 0;
  }
  figure = get_field_value(board,field_id);
  result = click_chessfield(field_id,figure);
  clear_possible_moves();
  if( result == 0 && pawn_promotion_check == 0 ){
    click = 0;
    if( clicked_field_id )
      clicked_field_id.style.backgroundColor = get_field_color(clicked_field);
    return 0;
  }
}

function dragEnd(event) {
  //console.log("KONIEC przesuwania ");
  //console.log(event.target);
  event.target.style.display='block';
}
// this function defines what happens after clicking on field, moving piece or pushing ENTER with arrows control enabled
function click_chessfield(field_sign,figure) {
  // funkcja do sprawdzenia - optymalizacja
	let check_move;
	let field = document.getElementById(field_sign);
	//let field_value = field.innerHTML;
	if( is_game_finished == 1 )
		return 0;
	if( pawn_promotion_check == 1 ){
		blink_chess_promotion_field();
		return 0;
	}
	if( click == 0 ){
		if( figure[0] != player )
			return 0;
		clicked_field_id = field;
		clicked_field = field_sign;
		clicked_field_value = figure;
		field_color = get_field_color(field_sign);
		if( figure != '' ){
		  field.style.backgroundColor = field_sign_color;
			click = 1;
		}
    if( showing_possible_moves == 1)
      show_possible_moves( field_sign );
	}
	else {
    //clear_color_fields();
		if( field_sign == clicked_field ){
			//console.log(field_color);
      if( arrow_control_switch == 1 && arrow_current_position == clicked_field )
          field.style.backgroundColor = arrow_current_position_color;
      else
			 field.style.backgroundColor = get_field_color(field_sign);
			click = 0;
      clear_possible_moves();
			return 0;
		}
		else if( figure[0] == player ){
      if( arrow_control_switch == 1 && arrow_current_position == clicked_field )
        clicked_field_id.style.backgroundColor = arrow_current_position_color;
      else
		    clicked_field_id.style.backgroundColor = get_field_color(clicked_field);
			clicked_field_id = field;
			clicked_field = field_sign;
			clicked_field_value = figure;
			//field_color = get_field_color(field);
			field.style.backgroundColor = field_sign_color;
      clear_possible_moves();
      if( showing_possible_moves == 1)
        show_possible_moves( field_sign );
      return 0;
		}
		else if( pawn_promotion_check == 2 ){
      if( current_move_change == 1 ){
        //console.log("Zmiana historii przy promocji piona");
      }
			pawn_promotion_check = 0;
			update_board_field(clicked_field,'');
			update_board_field(field_sign,pawn_promotion_piece);
			click = 0;
			current_move_from = clicked_field;
			current_move_to = field_sign;
			current_move_piece = clicked_field_value;
      moves.push(current_move_from+':'+current_move_to+':'+pawn_promotion_piece[1]);
			pawn_promotion_piece = '';
			//player = opposite_player( player );
			//render_chessboard();
		}
		else {
			check_move = check_move_possibility(clicked_field_value,figure,clicked_field,field_sign);
			//console.log('check_move_possibility('+clicked_field_value+','+figure+','+clicked_field+','+field_sign);
			if( check_move == 0 )
				return 0;
      if( game_with_computer == 0 && ( current_move_change == 1 ) ){
        if( current_move_global == moves.length-1 ){
        //if( current_move_global == moves.length-1 || moves[moves.length-1] == ( field_sign+':'+field_sign) ){
          current_move_change = 0;
        }
        else{
          answer = prompt("Are You sure You want to overwrite existing line? Enter 1 if YES, 0 if NO, c if You want to return to then end of line", "0");
          if( answer == 1 ){
            moves.length = current_move_global+1;
            current_move_change = 0;
            //return 0;
          }
          else if( answer == 'c'){
            back_to_move( moves.length-1 );
            current_move_change = 0;
            return 0;
          }
          else{
            return 0;
          }
        }
      }
			if( clicked_field_value[1] == 'P' && check_move == 2 ){
        clear_possible_moves();
        if( ( game_with_computer == 1 && player == computer_player ) || computer_move_function == 1 ){
           //field.style.backgroundColor = get_field_color(field_sign);
	         pawn_promotion_piece = computer_player+'Q';
	         pawn_promotion_check = 2;
           return click_chessfield( field_sign, figure);
           //return 0;
        }
				pawn_promotion( player,field_sign,figure);
				pawn_promotion_check = 1;
				return 0;
				//clicked_field_value = player+pawn_promotion_piece;
				//console.log( clicked_field_value );
			}
			if( en_passant == 1 && clicked_field_value[1] == 'P' && check_move == 4 )
				update_board_field(current_move_to,'');
			if( castling == 1 && clicked_field_value[1] == 'K' && check_move > 1 ){
				if( check_move == 2 ){
					check_if_second_rook_moved[player] = 1;
					if( player == 'W' ){
						update_board_field('F1',get_field_value(board,'H1'));
						update_board_field('H1','');
					}
					if( player == 'B' ){
						update_board_field('F8',get_field_value(board,'H8'));
						update_board_field('H8','');
					}
				}
				if( check_move == 3 ){
					check_if_first_rook_moved[player] = 1;
					if( player == 'W' ){
						update_board_field('D1',get_field_value(board,'A1'));
						update_board_field('A1','');
					}
					if( player == 'B' ){
						update_board_field('F1',get_field_value(board,'A8'));
						update_board_field('A8','');
					}
				}
				check_if_king_moved[player] = 1;
			}
			update_board_field(clicked_field,'');
			update_board_field(field_sign,clicked_field_value);
			click = 0;
			current_move_from = clicked_field;
			current_move_to = field_sign;
			current_move_piece = clicked_field_value;
			if( clicked_field_value[1] == 'K' )
				check_if_king_moved[player] = 1;
			if( castling == 1 && clicked_field_value[1] == 'R' ){
				if( clicked_field[0] == 'A' )
						check_if_first_rook_moved[player] = 1;
				if( clicked_field[0] == letters[dim-1] )
					check_if_second_rook_moved[player] = 1;
			}
      if( is_game_on == 0 ){
        after_game_start();
        is_game_on = 1;
      }
      moves.push(current_move_from+':'+current_move_to);
			//player = opposite_player( player );
			//render_chessboard();
		}
		player = opposite_player( player );
    if( auto_flip_view == 1 && game_with_computer == 0 ){
      flip_view = player;
    }
		generate_board();
	}
}
// function checking game result
function check_game_result( chessboard ){
   // przebudowanie funkcji? Żeby była piękniejsza?
	let div = document.getElementById("pawn-promotion-field");
	if( check_if_there_is_a_draw( chessboard ) ) {
		div.innerHTML = 'End of game. DRAW. 0.5 - 0.5';
		is_game_finished = 1;
		return 1;
	}
  if( check_if_king_is_checked( player,chessboard ) > 0 ){
  	if( check_if_king_is_mated( player,chessboard ) ) {
  		div.innerHTML = 'End of game. '+get_player_full_name( opposite_player(player),1 )+' wins !';
  	  //div.style.display= 'inline';
  		is_game_finished = 1;
  		return 1;
  	}
    else if( lighting_check == 1 ){
  		//div.innerHTML = 'Your KING is under check';
      //div.style.visibility = 'visible';
      show_check( chessboard,player );
      return 1;
    }
  }
	if( check_if_there_is_stalemate( chessboard ) ) {
		div.innerHTML = 'End of game. Stalemate. 0.5 - 0.5';
		is_game_finished = 1;
		return 1;
	}
	return 0;
}
// functions checking/showing move possibilities
function check_move_possibility(old_field_value,new_field_value,clicked_field,field_sign) {
	let piece = old_field_value[1];
	let result=0;
	let new_field = get_board_index( field_sign );
	let newx = new_field['x'];
	let newy = new_field['y'];
	let old_field = get_board_index( clicked_field );
	let oldx = old_field['x'];
	let oldy = old_field['y'];

	if( new_field_value[0] == player )
		return 0;
	switch( piece ) {
		case 'P':
			result=check_move_pawn(board,oldx,oldy,newx,newy);
			break;
		case 'R':
			result=check_move_rook(board,oldx,oldy,newx,newy);
			break;
		case 'N':
			result=check_move_knight(oldx,oldy,newx,newy);
			break;
		case 'B':
			result=check_move_bishop(board,oldx,oldy,newx,newy);
			break;
		case 'Q':
			result=check_move_queen(board,oldx,oldy,newx,newy);
			break;
		case 'K':
			result=check_move_king(board,old_field_value[0],oldx,oldy,newx,newy);
      if(result == 1){
        if( check_if_field_is_attacked(board,field_sign,opposite_player(player)) == 1  ){
          return 0;
        }
        else
          return 1;
      }
			break;
	}
	if( result == 0 )
		return result;
	if( check_if_king_will_be_checked_after_move( player,oldx,oldy,newx,newy,result ) == 1 ) {
		//console.log("King will be in check!");
		return 0;
	}
	return result;
}

function check_if_pawn_attacks_field(oldx,oldy,newx,newy,player,previous_move_piece,previous_move_from,previous_move_to) {
//function check_if_pawn_attacks_field(oldx,oldy,newx,newy,player ) {
	if( player == 'W' ) {
		if( newy == oldy-1 && ( newx == oldx-1 || newx == oldx+1 ) )
			return 1;
		if( en_passant == 1 && previous_move_piece == 'BP' && newy == oldy && ( newx == oldx-1 || newx == oldx+1 ) && previous_move_to == get_field_name_from_board(newx,newy) && previous_move_from == get_field_name_from_board(newx,newy-2) )
			return 1;
	}
	else {
		if( newy == oldy+1 && ( newx == oldx-1 || newx == oldx+1 ) )
			return 1;
		if( en_passant == 1 && previous_move_piece == 'WP' && newy == oldy && ( newx == oldx-1 || newx == oldx+1 ) && previous_move_to == get_field_name_from_board(newx,newy) && previous_move_from == get_field_name_from_board(newx,newy+2) )
			return 1;
	}
	return 0;
}

function check_move_pawn(chessboard,oldx,oldy,newx,newy) {
	let player = chessboard[oldy][oldx][0];
	if( player == 'W' ) {
		if( oldy ==1 && newy == oldy-1 && ( ( newx == oldx && chessboard[newy][newx] == '' ) || ( ( newx == oldx-1 || newx == oldx+1 ) && chessboard[newy][newx][0] == 'B'  ) ) )
			return 2;
		if( newx == oldx ){
			if( oldy == dim-2 && newy == oldy-2 && chessboard[oldy-1][oldx] == '' && chessboard[oldy-2][oldx] == '' )
				return 1;
			if( newy == oldy-1 && chessboard[oldy-1][oldx] == '' )
				return 1;
		}
		else{
			if( newy == oldy-1 && chessboard[newy][newx][0] == 'B' && ( newx == oldx-1 || newx == oldx+1 ) )
				return 1;
			if( en_passant == 1 && current_move_piece == 'BP' && newy == oldy-1 && ( newx == oldx-1 || newx == oldx+1 ) && current_move_to == get_field_name_from_board(newx,oldy) && current_move_from == get_field_name_from_board(newx,oldy-2) )
				return 4;
		}
	}
	else {
		if( oldy ==dim-2 && newy == oldy+1 && ( ( newx == oldx && chessboard[newy][newx] == '' ) || ( ( newx == oldx-1 || newx == oldx+1 ) && chessboard[newy][newx][0] == 'W'  ) ) )
			return 2;
		if( newx == oldx ){
			if( oldy == 1 && newy == oldy+2 && chessboard[oldy+1][oldx] == '' && chessboard[oldy+2][oldx] == '' )
				return 1;
			if( newy == oldy+1 && chessboard[oldy+1][oldx] == '' )
				return 1;
		}
		else {
			if( newy == oldy+1 && chessboard[newy][newx][0] == 'W' && ( newx == oldx-1 || newx == oldx+1 ) )
				return 1;
			if( en_passant == 1 && current_move_piece == 'WP' && newy == oldy+1 && ( newx == oldx-1 || newx == oldx+1 ) && current_move_to == get_field_name_from_board(newx,oldy) && current_move_from == get_field_name_from_board(newx,oldy+2) )
				return 4;
		}
	}
	return 0;
}

function check_move_rook(chessboard,oldx,oldy,newx,newy) {
	/*if( ( newx == oldx ) || ( newy == oldy ) )
		return 1;
	else
		return 0;*/
	if( newx != oldx && newy != oldy )
		return 0;
	if( newx == oldx ){
		if( newy > oldy ){
			for( let i = oldy+1 ; i < newy ; i++ ){
				if( chessboard[i][newx] != '' )
					return 0;
			}
			return 1;
		}
		else {
			for( let i = oldy-1 ; i > newy ; i-- ){
				if( chessboard[i][newx] != '' )
					return 0;
			}
			return 1;
		}
	}
	else {
		if( newx > oldx ){
			for( let i = oldx+1 ; i < newx ; i++ ){
				if( chessboard[newy][i] != '' )
					return 0;
			}
			return 1;
		}
		else {
			for( let i = oldx-1 ; i > newx ; i-- ){
				if( chessboard[newy][i] != '' )
					return 0;
			}
			return 1;
		}
	}
	return 0;
}

function check_move_knight(oldx,oldy,newx,newy) {
	if( ( ( newx == oldx+2 || newx == oldx-2 ) && ( newy == oldy+1 || newy == oldy-1 ) ) || ( ( newx == oldx+1 || newx == oldx-1 ) && ( newy == oldy+2 || newy == oldy-2 ) ) )
		return 1;
	else
		return 0;
}

function check_move_bishop(chessboard,oldx,oldy,newx,newy) {
	if( newx > oldx ) {
		diffx = newx-oldx
		diffx_dir = '+';
	}
	else {
		diffx = oldx-newx
		diffx_dir = '-';
	}
	if( newy > oldy ) {
		diffy = newy-oldy
		diffy_dir = '+';
	}
	else {
		diffy = oldy-newy
		diffy_dir = '-';
	}
	if( diffx == diffy ) {
		for( let i = 1 ; i < diffx ; i++ ) {
			if( diffy_dir == '+' )
				y = oldy + i;
			else
				y = oldy - i;
			if( diffx_dir == '+' )
				x = oldx + i;
			else
				x = oldx - i;
			//console.log('x : '+x+'  , y : '+y);
			//console.log( chessboard[y][x]);
			if( chessboard[y][x] != '' ) {
				return 0;
			}
		}
		return 1;
	}
	return 0;
}

function check_move_queen(chessboard,oldx,oldy,newx,newy) {
	if( check_move_rook(chessboard,oldx,oldy,newx,newy) == 1 )
		return 1;
	if( check_move_bishop(chessboard,oldx,oldy,newx,newy) == 1 )
		return 1;
	return 0;
}

function check_move_king(chessboard, player, oldx,oldy,newx,newy) {
	let fields = [];
	if( ( newy == oldy && ( newx == oldx -1 || newx == oldx + 1 ) ) || ( newx == oldx && ( newy == oldy -1 || newy == oldy + 1 ) ) || ( ( newx == oldx+1 || newx == oldx-1 ) && ( newy == oldy+1 || newy == oldy-1 ) ) )
		return 1;
	if( castling == 1 && newy == oldy && check_if_king_moved[player] == 0 && ! check_if_king_is_checked(player,board) ){
		if( newx == oldx+2 && board[oldy][newx+1] == (player+'R') && check_if_second_rook_moved[player] == 0 ){
			fields = show_fields_between_piece_and_destination(board,oldx,oldy,newx+1,newy);
			for( let i=0;i<fields.length;i++ ){
				if( get_field_value( board,fields[i] ) != '' )
					return 0;
				if( check_if_field_is_attacked( board,fields[i],opposite_player(player)) > 0 )
					return 0;
			}
			return 2;
		}
		if( newx == oldx-2 && board[oldy][0] == (player+'R') && check_if_first_rook_moved[player] == 0 ){
		  //fields = show_fields_between_piece_and_destination(board,oldx,oldy,0,newy);
			fields = show_fields_between_piece_and_destination(board,oldx,oldy,newx-1,newy);
			for( let i=0;i<fields.length;i++ ){
				if( get_field_value( board,fields[i] ) != '' )
					return 0;
				if( check_if_field_is_attacked( board,fields[i],opposite_player(player)) > 0 )
					return 0;
			}
			return 3;
		}
	}
	return 0;
}

function check_possible_moves_for_pawn( chessboard,px,py ){
	let moves = [];
	let x,y;
	let player=chessboard[py][px][0];
	let rival=opposite_player( player );
	if( chessboard[py][px][1] != 'P' )
		return 0;
	if( player == 'W' ) {
		if( py == dim-2 ){
			for( y=py-1;y>=py-2;y-- ){
				if( chessboard[y][px] != '' )
					break;
				moves.push( get_field_name_from_board(px,y) );
			}
		}
		else{
			if( chessboard[py-1][px] == '' )
				moves.push( get_field_name_from_board(px,py-1) );
		}
		if( px-1 >= 0 && chessboard[py-1][px-1][0] == rival )
			moves.push( get_field_name_from_board(px-1,py-1) );
		if(  px+1 < dim && chessboard[py-1][px+1][0] == rival )
			moves.push( get_field_name_from_board(px+1,py-1) );
		if( en_passant == 1 && current_move_piece == 'BP' ){
			if( current_move_to == get_field_name_from_board(px-1,py) && current_move_from == get_field_name_from_board(px-1,py-2) )
				moves.push( get_field_name_from_board(px-1,py-1) );
			if( current_move_to == get_field_name_from_board(px+1,py) && current_move_from == get_field_name_from_board(px+1,py-2) )
				moves.push( get_field_name_from_board(px+1,py-1) );
		}
	}
	if( player == 'B' ) {
		if( py == 1 ){
			for( y=py+1;y<=py+2;y++ ){
				if( chessboard[y][px] != '' )
					break;
				moves.push( get_field_name_from_board(px,y) );
			}
		}
		else{
			if( chessboard[py+1][px] == '' )
				moves.push( get_field_name_from_board(px,py+1) );
		}
		if( px-1 >= 0 && chessboard[py+1][px-1][0] == rival )
			moves.push( get_field_name_from_board(px-1,py+1) );
		if( px+1 < dim && chessboard[py+1][px+1][0] == rival )
			moves.push( get_field_name_from_board(px+1,py+1) );
		if( en_passant == 1 && current_move_piece == 'WP' ){
			if( current_move_to == get_field_name_from_board(px-1,py) && current_move_from == get_field_name_from_board(px-1,py+2) )
				moves.push( get_field_name_from_board(px-1,py+1) );
			if( current_move_to == get_field_name_from_board(px+1,py) && current_move_from == get_field_name_from_board(px+1,py+2) )
				moves.push( get_field_name_from_board(px+1,py+1) );
		}
	}
	return moves;
}

function check_possible_moves_for_rook( chessboard,rookx,rooky ){
	let moves = [];
	let x,y;
	let player=chessboard[rooky][rookx][0];
	let rival=opposite_player( player );
//	if( chessboard[rooky][rookx][1] != 'R' )
//		return 0;
	for( x=rookx+1;x<dim;x++){
		if( chessboard[rooky][x][0] == player  )
			break;
		moves.push( get_field_name_from_board(x,rooky) );
		if( chessboard[rooky][x][0] == rival )
			break;
	}
	for( x=rookx-1;x>=0;x--){
		if( chessboard[rooky][x][0] == player  )
			break;
		moves.push( get_field_name_from_board(x,rooky) );
		if( chessboard[rooky][x][0] == rival )
			break;
	}
	for( y=rooky+1;y<dim;y++){
		if( chessboard[y][rookx][0] == player  )
			break;
		moves.push( get_field_name_from_board(rookx,y) );
		if( chessboard[y][rookx][0] == rival )
			break;
	}
	for( y=rooky-1;y>=0;y--){
		if( chessboard[y][rookx][0] == player  )
			break;
		moves.push( get_field_name_from_board(rookx,y) );
		if( chessboard[y][rookx][0] == rival )
			break;
	}
	return moves;
}

function check_possible_moves_for_bishop( chessboard,bx,by ){
	let moves = [];
	let x;
	let y;
	let player=chessboard[by][bx][0];
	let rival=opposite_player( player );
//	if( chessboard[by][bx][1] != 'B' )
//		return 0;
	y=by;
	for( x=bx+1;x<dim;x++){
		y++;
		if( x >= dim || y >= dim )
			break;
		if( chessboard[y][x][0] == player  )
			break;
		moves.push( get_field_name_from_board(x,y) );
		if( chessboard[y][x][0] == rival )
			break;
	}
	y=by;
	for( x=bx+1;x<dim;x++){
		y--;
		if( x < 0 || y < 0 )
			break;
		//console.log("x:"+x+" y:"+y);
		if( chessboard[y][x][0] == player  )
			break;
		moves.push( get_field_name_from_board(x,y) );
		if( chessboard[y][x][0] == rival )
			break;
	}
	y=by;
	for( x=bx-1;x>=0;x--){
		y++;
		if( x >= dim || y >= dim )
			break;
		//console.log("x:"+x+" y:"+y);
		if( chessboard[y][x][0] == player  )
			break;
		moves.push( get_field_name_from_board(x,y) );
		if( chessboard[y][x][0] == rival )
			break;
	}
	y=by;
	for( x=bx-1;x>=0;x--){
		y--;
		if( x < 0 || y < 0 )
			break;
		//console.log("x:"+x+" y:"+y);
		if( chessboard[y][x][0] == player  )
			break;
		moves.push( get_field_name_from_board(x,y) );
		if( chessboard[y][x][0] == rival )
			break;
	}
	return moves;
}

function check_possible_moves_for_queen( chessboard,qx,qy ){
	let moves = [];
	let rook_moves = [];
	let bishop_moves = [];
	if( chessboard[qy][qx][1] != 'Q' )
		return 0;
	rook_moves=check_possible_moves_for_rook( chessboard,qx,qy );
	bishop_moves=check_possible_moves_for_bishop( chessboard,qx,qy );
	moves=rook_moves;
	for( let i=0;i<bishop_moves.length;i++){
		moves.push( bishop_moves[i] );
	}
	return moves;
}

function check_possible_moves_for_knight( chessboard,kx,ky ){
//function check_possible_moves_for_knight(){
	let moves = [];
	let possible_dim_change_1 = [ 2,-2,];
	let possible_dim_change_2 = [ 1,-1,];
	let i,j;
	let field;
	let player=chessboard[ky][kx][0];
//	if( chessboard[qy][qx][1] != 'N' )
//		return 0;
	for( i of possible_dim_change_1 ){
		for( j of possible_dim_change_2 ){
			field = get_field_name_from_board( (kx+i),(ky+j) );
			if ( field != 0 ){
				if( get_field_player( chessboard,field ) != player )
					moves.push(field);
			}
			field = get_field_name_from_board( (kx+j),(ky+i) );
			if ( field != 0 ){
				if( get_field_player( chessboard,field ) != player )
					moves.push(field);
			}
		}
	}
	return moves;
}

function check_possible_moves_for_king( chessboard,kx,ky ){
//function check_possible_moves_for_knight(){
	let moves = [];
	let x,y;
	let field;
  let castling_test;
	let player=chessboard[ky][kx][0];
	if( chessboard[ky][kx][1] != 'K' )
		return 0;
	for( y=ky-1;y<=ky+1;y++ ){
		for( x=kx-1;x<=kx+1;x++ ){
			if( x == kx && y == ky )
				continue;
			field = get_field_name_from_board( x,y );
			if ( field != 0 ){
				if( get_field_player( chessboard,field ) != player && check_if_king_will_be_checked_after_move( player,kx,ky,x,y,1 ) < 1 )
					moves.push(field);
			}
		}
	}
	if( castling == 1 && check_if_king_moved[player] == 0 && ! check_if_king_is_checked(player,chessboard) ){
		if( check_if_second_rook_moved[player] == 0 && chessboard[ky][dim-1] == (player+'R') ){
      castling_test = 1;
			for( fields of show_fields_between_piece_and_destination(chessboard,kx,ky,dim-1,ky) ){
				if( get_field_value( chessboard,fields ) != '' || check_if_field_is_attacked( chessboard,fields,opposite_player(player)) > 0 ){
          castling_test = 0;
					break;
        }
      }
      if( castling_test == 1 ){
        if( player == 'W' )
          field = letters[dim-2]+'1';
        else
          field = letters[dim-2]+'8';
        moves.push( field );
      }
		}
		if( check_if_first_rook_moved[player] == 0 && chessboard[ky][0] == (player+'R') ){
		  castling_test = 1;
			for( fields of show_fields_between_piece_and_destination(chessboard,kx,ky,1,ky) ){
				if( get_field_value( chessboard,fields ) != '' || check_if_field_is_attacked( chessboard,fields,opposite_player(player)) > 0 ){
          castling_test = 0;
          break;
        }
			}
      if( castling_test == 1 ){
        if( player == 'W' )
          field = letters[2]+'1';
        else
          field = letters[2]+'8';
        moves.push( field );
      }
		}
	}
	return moves;
}

function check_all_moves_for_king( chessboard,kx,ky ){
//function check_possible_moves_for_knight(){
	let moves = [];
	let x,y;
	let field;
	let player=chessboard[ky][kx][0];
	if( chessboard[ky][kx][1] != 'K' )
		return 0;
	for( y=ky-1;y<=ky+1;y++ ){
		for( x=kx-1;x<=kx+1;x++ ){
			if( x == kx && y == ky )
				continue;
			field = get_field_name_from_board( x,y );
			if ( field != 0 ){
				if( get_field_player( chessboard,field ) != player )
					moves.push(field);
			}
		}
	}
	if( castling == 1 && check_if_king_moved[player] == 0 ){
		if( check_if_second_rook_moved[player] == 0 && chessboard[ky][dim-1] == (player+'R') ){
      castling_test = 1;
			for( fields of show_fields_between_piece_and_destination(chessboard,kx,ky,dim-1,ky) ){
				if( get_field_value( chessboard,fields ) != '' || check_if_field_is_attacked( chessboard,fields,opposite_player(player)) > 0 ){
          castling_test = 0;
					break;
        }
      }
      if( castling_test == 1 ){
        if( player == 'W' )
          field = letters[dim-2]+'1';
        else
          field = letters[dim-2]+'8';
        moves.push( field );
      }
		}
		if( check_if_first_rook_moved[player] == 0 && chessboard[ky][0] == (player+'R') ){
		  castling_test = 1;
			for( fields of show_fields_between_piece_and_destination(chessboard,kx,ky,1,ky) ){
				if( get_field_value( chessboard,fields ) != '' || check_if_field_is_attacked( chessboard,fields,opposite_player(player)) > 0 ){
          castling_test = 0;
          break;
        }
			}
      if( castling_test == 1 ){
        if( player == 'W' )
          field = letters[2]+'1';
        else
          field = letters[2]+'8';
        moves.push( field );
      }
		}
	}
	return moves;
}

function check_if_field_is_accessible(chessboard,field,by_player) {
	//console.log(chessboard);
	let piece='';
	let fieldx,fieldy,result;
	let pieces=[];
	for( let i=0;i<dim;i++ ){
		for( let j=0;j<dim;j++){
			if( chessboard[i][j][0] == by_player ){
				fieldx=j;
				fieldy=i;
				result=check_if_field_is_accessible_by_piece( chessboard,by_player,fieldx, fieldy, chessboard[i][j], field );
				if( result > 0 ){
					//console.log("field is attacked by: "+field+"  ,result="+result+"  piece: "+chessboard[i][j]);
					return result;
				}
			}
		}
	}
	return 0;
}

function check_if_field_is_accessible_by_piece( chessboard,player,oldx,oldy,piece,new_field ) {
	let new_field_dim = get_board_index( new_field );
	let newx = new_field_dim['x'];
	let newy = new_field_dim['y'];
	if( oldx == newx && oldy == newy )
 		return 0;
	switch( piece[1] ) {
		case 'P':
			return check_move_pawn(chessboard,oldx,oldy,newx,newy);
			break;
		case 'R':
			return check_move_rook(chessboard,oldx,oldy,newx,newy);
			break;
		case 'N':
			return check_move_knight(oldx,oldy,newx,newy);
			break;
		case 'B':
			return check_move_bishop(chessboard,oldx,oldy,newx,newy);
			break;
		case 'Q':
			return check_move_queen(chessboard,oldx,oldy,newx,newy);
			break;
		case 'K':
			return check_move_king(chessboard,player,oldx,oldy,newx,newy);
			break;
	}
}

function check_if_field_is_attacked(chessboard,field,by_player) {
	let piece='';
	let fieldx,fieldy,result;
	let pieces=[];
	for( let i=0;i<dim;i++ ){
		for( let j=0;j<dim;j++){
			if( chessboard[i][j][0] == by_player ){
				fieldx=j;
				fieldy=i;
				result=check_if_field_is_attacked_by_piece( chessboard,fieldx, fieldy, chessboard[i][j], field );
				if( result > 0 ){
					return result;
				}
			}
		}
	}
	return 0;
}

function check_if_field_is_attacked_by_piece( chessboard,oldx,oldy,piece,new_field ) {
	let new_field_dim = get_board_index( new_field );
  let result;
	//let new_field_value = document.getElementById(field_sign).innerHTML;
	let newx = new_field_dim['x'];
	let newy = new_field_dim['y'];
	if( oldx == newx && oldy == newy )
 		return 0;
	switch( piece[1] ) {
		case 'P':
			return check_if_pawn_attacks_field(oldx,oldy,newx,newy,piece[0],current_move_piece,current_move_from,current_move_to);
			break;
		case 'R':
			return check_move_rook(chessboard,oldx,oldy,newx,newy);
			break;
		case 'N':
			return check_move_knight(oldx,oldy,newx,newy);
			break;
		case 'B':
			return check_move_bishop(chessboard,oldx,oldy,newx,newy);
			break;
		case 'Q':
			return check_move_queen(chessboard,oldx,oldy,newx,newy);
			break;
		case 'K':
			return check_move_king(chessboard,piece[0],oldx,oldy,newx,newy);
			break;
	}
}

function check_if_king_is_checked( player,chessboard ) {
	let piece = find_piece_on_board( chessboard,player+'K' );
	let kingx = piece['x'];
	let kingy = piece['y'];
	let field = get_field_name_from_board(kingx,kingy);
	player = opposite_player(player);
	return check_if_field_is_attacked(chessboard,field,player);
}

function check_if_king_is_mated( player,chessboard ) {
	let piece = find_piece_on_board( chessboard,player+'K' );
	let kingx = piece['x'];
	let kingy = piece['y'];
	let king_field = get_field_name_from_board(kingx,kingy);
	//let field = get_field_name_from_board(kingx,kingy);
	let king_fields = [];
	let opponent_color = opposite_player(player);
	let fieldx;
	let fieldy;
	let result;
	let attackers_count=0;
	let board_without_king = new Array(dim).fill(null).map(()=>new Array(dim).fill(null));
	for( let i=0;i<dim;i++ ){
		for( let j=0;j<dim;j++ ){
			board_without_king[i][j]=chessboard[i][j];
		}
	}
	board_without_king[kingy][kingx]='';
	king_fields.push( get_field_name_from_board(kingx-1,kingy) );
	king_fields.push( get_field_name_from_board(kingx+1,kingy) );
	king_fields.push( get_field_name_from_board(kingx,kingy+1) );
	king_fields.push( get_field_name_from_board(kingx,kingy-1) );
	king_fields.push( get_field_name_from_board(kingx-1,kingy+1) );
	king_fields.push( get_field_name_from_board(kingx+1,kingy+1) );
	king_fields.push( get_field_name_from_board(kingx-1,kingy-1) );
	king_fields.push( get_field_name_from_board(kingx+1,kingy-1) );
	for( let i=0;i<king_fields.length;i++ ){
		if( king_fields[i] != 0 && get_field_player( chessboard,king_fields[i] ) != player && check_if_field_is_attacked(board_without_king,king_fields[i],opponent_color) != 1 ){
			//console.log("Da się uciec, pole "+king_fields[i]);
			return 0;
		}
	}
	for( let i=0;i<dim;i++ ){
		for( let j=0;j<dim;j++){
			if( chessboard[i][j][0] == opponent_color ){
				fieldx=j;
				fieldy=i;
				result=check_if_field_is_attacked_by_piece( chessboard,fieldx, fieldy, chessboard[i][j], king_field );
				if( result > 0 ){
					attackers_count++;
					if( attackers_count >= 2 )
						return 1;
					if( check_if_player_can_capture_checking_piece( chessboard,player,fieldx,fieldy) == 0 && check_if_it_is_possible_to_block_check(chessboard,player,fieldx,fieldy,kingx,kingy) == 0 ) {
						return 1;
					}
				}
			}
		}
	}
	return 0;
}

function check_if_there_is_stalemate( chessboard ) {
	let moves = [];
	let king_field,kingx,kingy;
	king_field = find_piece_on_board( chessboard,player+'K' );
	kingx = king_field['x'];
	kingy = king_field['y'];
	king_field = get_field_name_from_board(kingx,kingy);
	rival = opposite_player( player );
	for( let field of get_player_fields_on_board( chessboard,player ) ){
		//console.log( field );
		if( field == king_field ){
			//console.log("Pominięty: "+field);
			continue;
		}
		moves = check_possible_moves_for_piece( chessboard,field );
		//console.log( moves );
		if( moves.length ) {
			return 0;
		}
	}
	if( check_if_king_can_not_escape( chessboard,player ) == 1 && check_if_king_is_checked( player,chessboard) == 0 ){
			return 1;
	}
	return 0;
}

function check_if_there_is_stalemate_for_two_sides( chessboard ) {
	let players=['W','B'];
	let moves = [];
	let rival;
	let test;
	let king_field,kingx,kingy;
	for( let side of players ){
		//console.log( side );
		king_field = find_piece_on_board( chessboard,side+'K' );
		kingx = king_field['x'];
		kingy = king_field['y'];
		king_field = get_field_name_from_board(kingx,kingy);
		rival = opposite_player( side );
		test = 1;
		//console.log("player: "+side);
		for( let field of get_player_fields_on_board( chessboard,side ) ){
			//console.log( field );
			if( field == king_field ){
				//console.log("Pominięty: "+field);
				continue;
			}
			moves = check_possible_moves_for_piece( chessboard,field );
			//console.log( moves );
			if( moves.length ) {
				test = 0;
				break;
			}
		}
		if( test == 1 ){
			//console.log("test = 1");
			//console.log("king can not escape: "+check_if_king_can_not_escape( chessboard,side ) );
			//console.log("king is checked?: "+check_if_king_is_checked( side,chessboard));
			if( check_if_king_can_not_escape( chessboard,side ) == 1 && check_if_king_is_checked( side,chessboard) == 0 ){
				if( side == player )
					return 1;
				else
					return 2;
			}
		}
	}
	return 0;
}

function check_if_there_is_a_draw( chessboard ) {
	let x,y;
	let color,piece;
	let white_low_piece_count = 0;
	let black_low_piece_count = 0;
	for( y=0;y<dim;y++ ){
		for( x=0;x<dim;x++){
			color = chessboard[y][x][0];
			piece = chessboard[y][x][1];
			if(  piece == 'Q' || piece == 'R' || piece == 'P' )
				return 0;
			if( piece == 'B' || piece == 'N' ){
				if( color == 'W' )
					white_low_piece_count++;
				else
					black_low_piece_count++;
			}
		}
	}
	if( white_low_piece_count < 2 && black_low_piece_count < 2 )
		return 1;
	return 0;
}

function update_chessboard( chessboard,move_from,move_to ){
  let move_from_x,move_from_y;
  let move_to_x,move_to_y;
  let moving_piece;
  current_move_from = move_from;
  current_move_to = move_to;
  move_from = get_board_index( move_from );
  move_from_x = move_from['x'];
  move_from_y = move_from['y'];
  move_to = get_board_index( move_to );
  move_to_x = move_to['x'];
  move_to_y = move_to['y'];
  moving_piece = chessboard[move_from_y][move_from_x];
  moving_player = moving_piece[0];
  rival = opposite_player( moving_player );
  current_move_piece = moving_piece;
  chessboard[move_from_y][move_from_x] = '';
  chessboard[move_to_y][move_to_x] = moving_piece;
  if( moving_piece[1] == 'K' ){
    check_if_king_moved[moving_player] = 1;
    if( move_to_x == ( move_from_x+2) ){
      chessboard[move_to_y][dim-1] = '';
      chessboard[move_to_y][move_to_x-1] = (moving_player+'R');
    }
    if( move_to_x == ( move_from_x-2) ){
      chessboard[move_to_y][0] = '';
      chessboard[move_to_y][move_to_x+1] = (moving_player+'R');
    }
  }
  if( moving_piece[1] == 'P' ){
    if( chessboard[move_from_y][move_to_x] == (rival+'P') )
      chessboard[move_from_y][move_to_x] = '';
    if( move_to_y == dim-1 || move_to_y == 0 ){
      chessboard[move_to_y][move_to_x] = (moving_player+pawn_promotion_piece);
    }
  }
  if( moving_piece[1] == 'R' ){
    if( current_move_from[0] == 'A' )
      check_if_first_rook_moved[moving_player] = 1;
    if( current_move_from[0] == letters[dim-1] )
      check_if_second_rook_moved[moving_player] = 1;
  }
}

function check_if_player_can_capture_checking_piece( chessboard,player,fieldx,fieldy ) {
	for( let i=0;i<dim;i++ ){
		for( let j=0;j<dim;j++ ){
			if( chessboard[i][j][0] == player ) {
				if( check_if_field_is_attacked_by_piece( chessboard,j,i,chessboard[i][j],get_field_name_from_board(fieldx,fieldy) ) > 0 ){
					if( check_if_king_will_be_checked_after_move( player,j,i,fieldx,fieldy ) == 1 ){
						continue;
					}
					return 1;
				}
			}
		}
	}
	return 0;
}

function check_if_it_is_possible_to_block_check(chessboard,by_player,oldx,oldy,newx,newy) {
	let fields_between = [];
	let result;
	let fieldx;
	let fieldy;
	fields_between = show_fields_between_piece_and_destination(chessboard,oldx,oldy,newx,newy);
	if( fields_between.length  == 0 )
		return 0;
	for( let i=0;i<dim;i++ ){
		for( let j=0;j<dim;j++){
			//if( chessboard[i][j][0] == by_player ){
			if( chessboard[i][j][0] == by_player && chessboard[i][j][1] != 'K' ){
				fieldx=j;
				fieldy=i;
				for( let k=0;k<fields_between.length;k++ ){
					result=check_if_field_is_accessible_by_piece( chessboard,by_player,fieldx,fieldy,chessboard[fieldy][fieldx],fields_between[k] );
					if( result > 0 ){
						field_between = get_board_index( fields_between[k] );
						field_between_x = field_between['x'];
						field_between_y = field_between['y'];
						if( check_if_king_will_be_checked_after_move( by_player,fieldx,fieldy,field_between_x,field_between_y ) == 1 )
							continue;
						return result;
					}
				}
			}
		}
	}
	return 0;
}

function show_possible_moves_to_escape_check( chessboard,checked_player ) {
  let moves=[];
  let checking_pieces=[];
  let result;
  let field_name;
  let fieldx,fieldy;
	let checking_player=opposite_player(checked_player);
	let king = find_piece_on_board( chessboard,checked_player+'K' );
	let kingx = king['x'];
	let kingy = king['y'];
  let king_field=get_field_name_from_board(kingx,kingy);
  for( let y=0;y<dim;y++ ){
    for( let x=0;x<dim;x++ ){
      if( chessboard[y][x][0] == checking_player ){
        fieldx=x;
        fieldy=y;
  			result=check_if_field_is_accessible_by_piece( chessboard,checked_player,fieldx,fieldy,chessboard[fieldy][fieldx],get_field_name_from_board(kingx,kingy) );
        if( result > 0 )
          checking_pieces.push(get_field_name_from_board(fieldx,fieldy));
      }
    }
  }
  for( let y=kingy-1;y<=kingy+1;y++){
    for( let x=kingx-1;x<=kingx+1;x++){
      if( y<0 || y>=dim || x<0 || x>=dim )
        continue;
      field_name=get_field_name_from_board(x,y);
      if( ( chessboard[y][x] == '' || chessboard[y][x][0] == checking_player ) && ! check_if_field_is_attacked(chessboard,field_name,checking_player)   )
        moves.push(king_field+':'+field_name);
    }
  }
  if( checking_pieces.length == 0 )
    return [];
  if( checking_pieces.length > 1 ){
    return moves;
  }
/*
  if/for( piece can take checking piece)
    moves.push(get_field_name_from_board(piece_x,piece_y)+':'+get_field_name_from_board(attacking_x,attacking_y));
  for( move of
  show_fields_between_piece_and_destination(board,get_x,get_y,kingx,kingy); ){
    if( field_is_accessible )
      moves.push(get_field_name_from_board(piecex,piecey)+':'+get_field_name_from_board(getx,gety));
  }
function show_pieces_which_can_access_field(chessboard,field,player_color)
*/
 // console.log(moves);
 // console.log(checking_pieces);
//	field = get_board_index( field );
}

function show_pieces_which_can_access_field(chessboard,field,player_color){
  let pieces=[];
  for( let y=0;y<dim;y++ ){
    for( let x=0;x<dim;x++ ){
      if( chessboard[y][x][0] == player_color || ( player_color=='u' && chessboard[y][x] != '' ) ){
        if( check_if_field_is_accessible_by_piece( chessboard,player_color,x,y,chessboard[y][x],field ) != 0){
          if( chessboard[y][x][1] == 'K' ){
            if( check_if_field_is_accessible(chessboard,field,opposite_player(player_color)) != 0 )
              continue;
          }
          pieces.push(get_field_name_from_board(x,y));
        }
      }
    }
  }
  return pieces;
}

function check_if_it_is_possible_to_block_access_to_field_from_piece(chessboard,oldx,oldy,newx,newy) {
	let result;
	let opponent_color;
	let fields_between = [];
	switch( chessboard[oldy][oldx][1] ) {
		case 'P':
			//return check_move_pawn(board,oldx,oldy,newx,newy,new_field_value);
			result = check_if_pawn_attacks_field(oldx,oldy,newx,newy,chessboard[oldy][oldx][0],current_move_piece,current_move_from,current_move_to);
			break;
		case 'R':
			result = check_move_rook(chessboard,oldx,oldy,newx,newy);
			break;
		case 'N':
			result = check_move_knight(oldx,oldy,newx,newy);
			break;
		case 'B':
			result = check_move_bishop(chessboard,oldx,oldy,newx,newy);
			break;
		case 'Q':
			result = check_move_queen(chessboard,oldx,oldy,newx,newy);
			break;
		case 'K':
			result = check_move_king(chessboard,chessboard[oldy][oldx][0],oldx,oldy,newx,newy);
      if(result == 1){
        if(check_if_field_is_attacked(chessboard,get_field_name_from_board(newx,newy),opposite_player(chessboard[oldy][oldx][0])) == 1 )
          return 0;
        else
          return 1;
      }
			break;
	}
	if( result == 0 )
		return 0;
	if( chessboard[oldy][oldx][0] == 'W' )
		opponent_color = 'B';
	else
		opponent_color ='W';
	fields_between = show_fields_between_piece_and_destination(chessboard,oldx,oldy,newx,newy);
	for( let i=0;i<fields_between.length;i++ ){
		if( check_if_field_is_attacked(chessboard,fields_between[i],chessboard[oldy][oldx][0] ) > 0 )
			return 1;
	}
	return 0;
}

function check_possible_moves_for_piece( chessboard,field ){
	//let result = [];
	let color,piece,player;
	let x,y;
	let target_x,target_y;
	let dims;
	field = get_board_index( field );
	x = field['x'];
	y = field['y'];
	piece = chessboard[y][x];
	player = piece[0];
	if( piece == '' )
		return 0;
	switch( piece[1] ) {
		case 'P':
			result=check_possible_moves_for_pawn( chessboard,x,y );
			break;
		case 'R':
			result=check_possible_moves_for_rook( chessboard,x,y );
			break;
		case 'N':
			result=check_possible_moves_for_knight( chessboard,x,y );
			break;
		case 'B':
			result=check_possible_moves_for_bishop( chessboard,x,y );
			break;
		case 'Q':
			result=check_possible_moves_for_queen( chessboard,x,y );
			break;
		case 'K':
			result=check_possible_moves_for_king( chessboard,x,y );
			break;
	}
	for( let i=0;i<result.length;i++ ){
		target = get_board_index( result[i] );
		target_x = target['x'];
		target_y = target['y'];
		if( check_if_king_will_be_checked_after_move( player,x,y,target_x,target_y ) ){
			result.splice(i,1);
			i--;
		}
	}
	return result;
}

function show_fields_between_piece_and_destination(chessboard,oldx,oldy,newx,newy) {
	let fields = [];
	let diffx,diffx_dir,x;
	let diffy,diffy_dir,y;
	let i;
	if( oldy == newy ){
		if( oldx > newx ){
			for( i=newx+1;i<oldx;i++ ){
				fields.push( get_field_name_from_board(i,newy) );
			}
		}
		if( oldx < newx ){
			for( i=oldx+1;i<newx;i++ ){
				fields.push( get_field_name_from_board(i,newy) );
			}
		}
		return fields;
	}
	if( oldx == newx ){
		if( oldy > newy ){
			for( i=newy+1;i<oldy;i++){
				fields.push( get_field_name_from_board(newx,i) );
			}
		}
		if( newy > oldy ){
			for( i=oldy+1;i<newy;i++ ){
				fields.push( get_field_name_from_board(newx,i) );
			}
		}

	}

	if( newx > oldx ) {
		diffx = newx-oldx
		diffx_dir = '+';
	}
	else {
		diffx = oldx-newx
		diffx_dir = '-';
	}
	if( newy > oldy ) {
		diffy = newy-oldy
		diffy_dir = '+';
	}
	else {
		diffy = oldy-newy
		diffy_dir = '-';
	}
	if( diffx == diffy ) {
		for( let i = 1 ; i < diffx ; i++ ) {
			if( diffy_dir == '+' )
				y = oldy + i;
			else
				y = oldy - i;
			if( diffx_dir == '+' )
				x = oldx + i;
			else
				x = oldx - i;
			fields.push( get_field_name_from_board(x,y) );
		}
	}
	return fields;
}

function show_fields_from_piece_to_destination(chessboard,oldx,oldy,newx,newy){
  let fields=[];
  fields.push(get_field_name_from_board(oldx,oldy));
  fields=fields.concat(show_fields_between_piece_and_destination(chessboard,oldx,oldy,newx,newy));
  fields.push(get_field_name_from_board(newx,newy));
  return fields;
}

function show_fields_between_from_piece_and_destination(chessboard,oldx,oldy,newx,newy){
  let fields=[];
  fields.push(get_field_name_from_board(oldx,oldy));
  fields=fields.concat(show_fields_between_piece_and_destination(chessboard,oldx,oldy,newx,newy));
  return fields;
}

function check_if_king_can_not_escape( chessboard,player ) {
	let piece = find_piece_on_board( chessboard,player+'K' );
	let kingx = piece['x'];
	let kingy = piece['y'];
	//let field = get_field_name_from_board(kingx,kingy);
	let king_fields = [];
	let opponent;
	opponent = opposite_player(player);
	king_fields.push( get_field_name_from_board(kingx-1,kingy) );
	king_fields.push( get_field_name_from_board(kingx+1,kingy) );
	king_fields.push( get_field_name_from_board(kingx,kingy+1) );
	king_fields.push( get_field_name_from_board(kingx,kingy-1) );
	king_fields.push( get_field_name_from_board(kingx-1,kingy+1) );
	king_fields.push( get_field_name_from_board(kingx+1,kingy+1) );
	king_fields.push( get_field_name_from_board(kingx-1,kingy-1) );
	king_fields.push( get_field_name_from_board(kingx+1,kingy-1) );
	for( let i=0;i<king_fields.length;i++ ){
		if( king_fields[i] != 0 && get_field_player( chessboard,king_fields[i] ) != player && check_if_field_is_attacked(chessboard,king_fields[i],opponent) != 1 )
			return 0;
	}
	return 1;
}

function check_if_king_will_be_checked_after_move( player,oldx,oldy,newx,newy,move_status=1 ) {
	let previous_move,previous_move_x,previous_move_y;
	let board_after_move = new Array(dim).fill(null).map(()=>new Array(dim).fill(null));
	for( let i=0;i<dim;i++ ){
		for( let j=0;j<dim;j++ ){
			board_after_move[i][j] = board[i][j];
		}
	}
	board_after_move[oldy][oldx] = '';
	board_after_move[newy][newx] = board[oldy][oldx];
	//if( en_passant == 1 && move_status == 4 ){
	if( en_passant == 1 && board[oldy][oldx] == (player+'P') && board[oldy][newx] == (opposite_player(player)+'P') && board[newy][newx] == '' ){
		board_after_move[oldy][newx] = '';
	}
/*
	//console.log("CURRENT BOARD");
	//console_log_board( board );
	//console.log("AFTER MOVE");
	//console_log_board( board_after_move );
	//console.log("WYNIK sprawdzenia  :  "+check_if_king_is_checked( player,board_after_move ) );
*/
	return check_if_king_is_checked( player,board_after_move );
}


// FUNCTIONS to get
function opposite_player(player) {
	if( player == 'W' )
		return 'B';
	else
		return 'W';
}

function get_player_full_name( player,letter_type=0 ){
  let name;
  if( player == 'W' )
    name = 'white';
  if( player == 'B' )
    name = 'black';
  if( letter_type == 1 )
    name = name.charAt(0).toUpperCase() + name.slice(1);
  else if( letter_type == 2 )
    name = name.toUpperCase();
  return name;
}
// function to get piece. GOOD to use usually for individual piece ( K,Q ), especially KING.
function find_piece_on_board( chessboard,piece ) {
	for( let y=0 ; y<dim ; y++ ) {
		for( let x=0 ; x<dim ; x++ ) {
			if( chessboard[y][x] == piece )
				return JSON.parse( '{ "x" : '+x+', "y" : '+y+' }' );
		}
	}
	return 0;
}

// function to get coordinates x,y of field (A1,H8...) from 2d array representing chessboard
function get_board_index( field ) {
	let y;
	let x;
	let json;
	y = dim - parseInt(field[1],0);
 	for( let i =0 ; i < letters.length ; i++ ){
		if( letters[i] == field[0] ){
			x = i;
			break;
		}
	}
	json = '{ "x" : '+x+', "y" : '+y+' }';
	return JSON.parse(json);
}

function get_index_x( field ){
 	for( let x =0 ; x < letters.length ; x++ ){
		if( letters[x] == field[0] ){
      return x;
		}
	}
}

function get_index_y( field ){
  return (dim - parseInt(field[1],0));
}
// function to get field name (A1,H8...) from coordinates x,y ( indexes of 2d array representing chessboard )
function get_field_name_from_board(x,y) {
	if( x < 0 || x >= dim || y < 0 || y >= dim )
		return 0;
	y=dim-y;
	return letters[x]+y;
}

function get_field_value( chessboard,field ) {
	let dims=get_board_index( field );
	let x=dims['x'];
	let y=dims['y'];
	return chessboard[y][x];
}

function get_player_pieces_on_board( chessboard,player ){
	let x,y;
	let pieces = [];
	for( y=0;y<dim;y++ ){
		for( x=0;x<dim;x++ ){
			if( chessboard[y][x][0] == player )
				pieces.push( chessboard[y][x] );
		}
	}
	return pieces;
}

function get_player_fields_on_board( chessboard,player ){
	let x,y;
	let fields = [];
	for( y=0;y<dim;y++ ){
		for( x=0;x<dim;x++ ){
			if( chessboard[y][x][0] == player )
				fields.push( get_field_name_from_board( x,y ) );
		}
	}
	return fields;
}
// return player (W/B or '') of field
function get_field_player( chessboard,field ) {
	let dims=get_board_index( field );
	let x=dims['x'];
	let y=dims['y'];
	return chessboard[y][x][0];
}

function get_field_color(field){
  let color;
  let field_name;
	for( let i = 0 ; i < dim ; i++ ){
		if( i % 2 == 0 )
			color = 'white';
		else
			color = 'black';
		for( let j = 0 ; j < dim ; j++ ){
      field_name = letters[j]+( dim - i );
      if( String(field) == String(field_name) ){
        return color;
      }
      if( color == 'white' )
        color = 'black';
      else
        color = 'white';
		}
	}
  return 0;
}

function update_board_field(name,value) {
	let y;
	let x;
	y = dim - parseInt(name[1],0);
 	for( let i =0 ; i < letters.length ; i++ ){
		if( letters[i] == name[0] ){
			x = i;
			break;
		}
	}
	board[y][x] = value;
}

// toggle ( switching/checkbox ) functions

function toggle_special_moves( checkbox ) {
  let castling_checkbox = document.getElementById("castling-check");
  let en_passant_checkbox = document.getElementById("en_passant-check");
  if( is_game_on != 0 ){
    return 0;
  }
  if( checkbox.checked == true ){
    castling = 1;
    en_passant = 1;
    castling_checkbox.checked = true;
    en_passant_checkbox.checked = true;
  }
  else{
    castling = 0;
    en_passant = 0;
    castling_checkbox.checked = false;
    en_passant_checkbox.checked = false;
  }
}

function toggle_castling( checkbox ) {
  if( is_game_on != 0 ){
    return 0;
  }
  if( checkbox.checked == true ){
    castling = 1;
  }
  else{
    castling = 0;
  }
}

function toggle_en_passant( checkbox ) {
  if( is_game_on != 0 ){
    return 0;
  }
  if( checkbox.checked == true ){
    en_passant = 1;
  }
  else{
    en_passant = 0;
  }
}

function toggle_special_effects( checkbox ){
  let checkbox_toggle_show_possible_moves_check = document.getElementById("show_possible_moves-check");
  let checkbox_toggle_check_lighting = document.getElementById("check_lighting-check");
  //let checkbox_toggle_final_result_lighting = document.getElementById("final_result-check");
  let checkbox_toggle_control_with_arrows = document.getElementById("control_with_arrows-check");
  if( checkbox.checked == true ){
    checkbox_toggle_show_possible_moves_check.checked = false;
    checkbox_toggle_check_lighting.checked = false;
    //checkbox_toggle_final_result_lighting.checked = false;
    checkbox_toggle_control_with_arrows.checked = false;
  }
  else{
    checkbox_toggle_show_possible_moves_check.checked = true;
    checkbox_toggle_check_lighting.checked = true;
    //checkbox_toggle_final_result_lighting.checked = true;
    checkbox_toggle_control_with_arrows.checked = true;
  }
  checkbox_toggle_control_with_arrows.click();
  checkbox_toggle_show_possible_moves_check.click();
  checkbox_toggle_check_lighting.click();
  //checkbox_toggle_final_result_lighting.click();
}

function toggle_show_possible_moves_check( checkbox ) {
  if( checkbox.checked == true ){
    showing_possible_moves = 1;
    if( click > 0 )
      show_possible_moves( clicked_field );
  }
  else{
    showing_possible_moves = 0;
    clear_possible_moves();
  }
}

function toggle_check_lighting( checkbox ) {
  if( checkbox.checked == true ){
    lighting_check  = 1;
    if( check_if_king_is_checked( player,board ) )
      show_check( board,player );
  }
  else{
    lighting_check  = 0;
    clear_possible_moves( 'check' );
  }
}

function toggle_final_result_lighting( checkbox ) {
  if( checkbox.checked == true ){
    lighting_final_result_pieces = 1;
    if( is_game_finished == 1 )
      show_final_position(player,'mate');
  }
  else{
    lighting_final_result_pieces = 0;
  }
}

// functions for visual effects like lighting possible moves

function show_possible_moves( field ){
  if( ! field || ! get_field_value( board,field )  )
    return 0;
  for( fields of check_possible_moves_for_piece( board,field ) ){
    document.getElementById( fields ).style.backgroundColor = possible_move_show_color;
  }
}

function clear_possible_moves( type='moves' ){
  let field;
  let color;
  let color_to_clear = 'moves';
  switch( type ){
    case 'moves':
      color_to_clear = possible_move_show_color;
      break;
    case 'check':
      color_to_clear = check_show_color;
      break;
  }
	for( let i = 0 ; i < dim ; i++ ){
		if( i % 2 == 0 )
			color = 'white';
		else
			color = 'black';
		for( let j = 0 ; j < dim ; j++ ){
      field = document.getElementById(letters[j]+( dim - i ));
			if( field.style.backgroundColor == color_to_clear ){
        field.style.backgroundColor = color;
      }
      if( color == 'white' )
        color = 'black';
      else
        color = 'white';
		}
	}
}

function show_check( chessboard,checked_player ){
	let piece = find_piece_on_board( chessboard,checked_player+'K' );
	let kingx = piece['x'];
	let kingy = piece['y'];
	let king_field = get_field_name_from_board(kingx,kingy);
  document.getElementById(king_field).style.backgroundColor = check_show_color;
	for( field of get_fields_of_pieces_attacking_field( chessboard,king_field ) ){
    document.getElementById(field).style.backgroundColor = check_show_color;
  }
}

function show_final_position( vulnerable_king_player,position ){
	let king = find_piece_on_board( board,vulnerable_king_player+'K' );
	let kingx = king['x'];
	let kingy = king['y'];
	let king_field = get_field_name_from_board(kingx,kingy);
  let x,y;
  let field;
  let checking_color = 'red';
  let king_army_piece_color = 'green';
  let enemy_army_piece_color = 'purple';
  let empty_attacked_field_color = 'orange';
  for( y=kingy-1;y<=kingy+1;y++ ){
    for( x=kingx-1;x<=kingx+1;x++ ){
			if( x == kingx && y == kingy )
				continue;
			field = get_field_name_from_board( x,y );
			if ( field == 0 )
        continue;
      if( board[y][x] == '' ){
        document.getElementById(field).style.backgroundColor = empty_attacked_field_color;
      }
      //document.getElementById(field).style.boxShadow="0px 0px 0px 10px red inset";
      else if( board[y][x][0] == vulnerable_king_player ){
        document.getElementById(field).style.backgroundColor = king_army_piece_color;
        continue;
      }
      else if( board[y][x][0] == opposite_player(vulnerable_king_player) ){
        document.getElementById(field).style.backgroundColor = enemy_army_piece_color;
        for( defending_piece of get_fields_of_pieces_attacking_field( board,field,opposite_player(vulnerable_king_player) )  ){
          field_color_div = document.getElementById(defending_piece);
          if( field_color_div.style.backgroundColor == 'undefined' || field_color_div.style.backgroundColor == null || ( field_color_div.style.backgroundColor != checking_color && field_color_div.style.backgroundColor != empty_attacked_field_color) )
            field_color_div.style.backgroundColor = enemy_army_piece_color;
        }
        continue;
      }
    }
  }
  if( position == 'stalemate' ){
    document.getElementById(king_field).style.backgroundColor = 'green';
  }
  else if( position == 'mate' ){
    show_check( board,vulnerable_king_player );
  }
}

function clear_color_fields(){
  let color;
	for( let i = 0 ; i < dim ; i++ ){
		if( i % 2 == 0 )
			color = 'white';
		else
			color = 'black';
		for( let j = 0 ; j < dim ; j++ ){
			document.getElementById(letters[j]+( dim - i )).style.backgroundColor = color;
      if( color == 'white' )
        color = 'black';
      else
        color = 'white';
		}
	}
	return 0;
}

// flipping VIEW functions/decisions

function switch_auto_flipping_view(){
  let button = document.getElementById("button-switch-auto-flip-view");
  let current_width;
  if( auto_flip_view == 0 ){
    auto_flip_view = 1;
    button.style.backgroundColor = "green";
    button.value = "turn OFF flipping view";
  }
  else{
    auto_flip_view = 0;
    current_width = button.offsetWidth;
    button.style.backgroundColor = "red";
    button.value = "turn ON flipping view";
    button.style.width = current_width;
  }
}

function flip_view_func(obj=''){
  let focused;
  if( obj != '' )
    focused = document.activeElement.id;
	if( flip_view == 'W' )
		flip_view = 'B';
	else
		flip_view = 'W';
  render_field_signs();
  render_chessboard();
	//generate_board();
  if( click == 1 )
    document.getElementById(clicked_field).style.backgroundColor = field_sign_color;
  if( showing_possible_moves == 1 )
    show_possible_moves( clicked_field );
  if( lighting_check == 1 && check_if_king_is_checked(player,board) > 0 )
    show_check( board,player );
  if( obj != '' && focused == obj.id )
    obj.blur();
}
// memorial
function flip_view_with_pure_js() {
	let chessboard = document.getElementById("board");
  for (var i = 1; i < chessboard.childNodes.length; i++){
      chessboard.insertBefore(chessboard.childNodes[i], chessboard.firstChild);
  }
}

// FUNCTIONS for game decisions ( buttons )
function resign() {
  if( is_game_finished == 1 )
    return 0;
  let div = document.getElementById("pawn-promotion-field");
  let answer = window.confirm("Are You sure You want to resign?");
  if (answer) {
  	div.innerHTML = 'You resigned. '+get_player_full_name( opposite_player(player),1 ) +' wins';
  	is_game_finished = 1;
    is_game_on = 0;
  }
}

function offer_draw() {
  // function will be programmed after creating options of playing with computer
  // and real opponent
  let div = document.getElementById("pawn-promotion-field");
  let answer = window.confirm("Are You sure You want to offer a DRAW?");
  if (answer) {
  	div.innerHTML = 'You offered a draw. Wait for opponent decision';
  }
}

function take_back_last_move(obj=''){
  let focused;
  if( obj != '' )
    focused = document.activeElement.id;
  if( moves.length < 2 || game_with_computer == 1 )
    return 0;
  back_to_move( moves.length-2 );
  moves.length = moves.length-1;
  render_moves_history();
  current_move_change = 0;
  if( obj != '' && focused == obj.id )
    obj.blur();
}


function pawn_promotion( player,id,figure ){
	let field_id = "pawn-promotion-field";
	let div = document.getElementById( field_id );
  let id_div = document.getElementById(id);
	let promotion_pieces = ['R','N','B','Q'];
	let content = '';
  let id_color;
	for( let i=0;i<promotion_pieces.length;i++){
		//html_figure = html_chess[player+promotion_pieces[i]];
    html_figure = '<img src="image/'+(player+promotion_pieces[i])+'_white_field.png" height="'+pawn_promotion_field_image_size+'px" width="'+pawn_promotion_field_image_size+'px"/>';
		//content += html_figure+' ';
		content += '<div class="promotion-piece" onclick="pawn_promote(\''+player+promotion_pieces[i]+'\',\''+id+'\',\''+figure+'\')">'+html_figure+'</div>';
	}
  id_color = id_div.style.backgroundColor;
  html_figure = '<img height="'+(0.8*pawn_promotion_field_image_size)+'px" width="'+(0.8*pawn_promotion_field_image_size)+'px" src="image/cancel.png"/>';
	content += '<div id="promotion-piece-cancel" onclick="revert_pawn_promotion(\''+id+'\',\''+id_color+'\')">'+html_figure+'</div>';
  id_div.style.backgroundColor = field_sign_color;
	div.innerHTML = content;
	return 1;
}

function pawn_promote( piece,id,figure ){
	let field_id = "pawn-promotion-field";
	let div = document.getElementById( field_id );
	pawn_promotion_piece = piece;
	pawn_promotion_check = 2;
	//console.log( pawn_promotion_piece );
	click_chessfield( id,figure );
	div.innerHTML = '';
}

function revert_pawn_promotion( promotion_field,color ){
	let field_id = "pawn-promotion-field";
	let div = document.getElementById( field_id );
  pawn_promotion_check = 0;
  click=0;
  document.getElementById(promotion_field).style.backgroundColor = color;
  clicked_field_id.style.backgroundColor = field_color;
  div.innerHTML = '';
}

function blink_chess_promotion_field() {
	let field_id = "pawn-promotion-field";
	let div = document.getElementById( field_id );
	let background = document.body.style.backgroundColor;
	let turns = 5;
	let count = 0;
	let x = setInterval( blink,400);
	div.style.backgroundColor = background;
	function blink(){
		if( count == turns ){
			clearInterval(x);
		}
		if( div.style.backgroundColor != background )
			div.style.backgroundColor = background;
		else
			div.style.backgroundColor = possible_move_show_color;
		count++;
	}
}

function after_game_start(){
  document.getElementById("special-moves-check").disabled = true;
  document.getElementById("castling-check").disabled = true;
  document.getElementById("en_passant-check").disabled = true;
}

function get_fields_of_pieces_attacking_field( chessboard,attacked_field,by_player='' ){
  let x,y;
  let rival;
  let fields = [];
  let attacked_field_coords = get_board_index(attacked_field);
  let attacked_field_x = attacked_field_coords['x'];
  let attacked_field_y = attacked_field_coords['y'];
  let attacked_player = chessboard[attacked_field_y][attacked_field_x][0];
  //console.log("attacked_player: "+attacked_player);
  if( by_player == '' ){
    if( attacked_player )
      rival = opposite_player(attacked_player);
    else
      rival = '';
  }
  else if( by_player == 'W' || by_player == 'B' )
    rival = by_player;
  //console.log("rival: "+rival);
  //console.log("field: "+attacked_field);
  for( y=0;y<dim;y++){
    for( x=0;x<dim;x++ ){
      if( rival && chessboard[y][x][0] != rival ){
        continue;
      }
      if( check_if_field_is_attacked_by_piece( chessboard,x,y,chessboard[y][x],attacked_field ) )
        fields.push( get_field_name_from_board(x,y) );
    }
  }
  return fields;
}

function show_remaining_pieces(){
  let div_white = document.getElementById("white-figures");
  let div_black = document.getElementById("black-figures");
  let div_white_uniq = document.getElementById("white-uniq-figures");
  let div_black_uniq = document.getElementById("black-uniq-figures");
  let white_pieces = [];
  let white_uniq_pieces = [];
  let black_pieces = [];
  let black_uniq_pieces = [];
  let content = '';
  let img_size = parseInt(square_side/2);
  //console.log(img_size+" px");
  white_pieces = get_remaining_pieces( board,'W' );
  black_pieces = get_remaining_pieces( board,'B' );
  white_uniq_pieces = get_uniq_chess_pieces(white_pieces,black_pieces);
  black_uniq_pieces = get_uniq_chess_pieces(black_pieces,white_pieces);
  //console.log(white_uniq_pieces);
  //console.log(black_uniq_pieces);
  for( piece of white_pieces ){
    //content += '<div style="border:solid 1px black;display:inline-block;"><img src="image/'+'W'+piece+'.png" height="'+img_size+'px" width="'+img_size+'px"></img></div>';
    content += '<div style="display:inline-block;"><img src="image/min_'+'W'+piece+'.png" height="'+img_size+'px" ></img></div>';
  }
  div_white.innerHTML = content;
  content = '';
  for( piece of black_pieces ){
    //content += '<div style="border:solid 1px black;display:inline-block;"><img src="image/'+'B'+piece+'.png" height="'+img_size+'px" width="'+img_size+'px"></img></div>';
    content += '<div style="display:inline-block;"><img src="image/min_'+'B'+piece+'.png" height="'+img_size+'px" ></img></div>';
  }
  div_black.innerHTML = content;
  content = '';
  for( piece of white_uniq_pieces ){
    content += '<img src="image/min_'+'W'+piece+'.png" height="'+img_size+'px"></img>';
  }
  div_white_uniq.innerHTML = content;
  content = '';
  for( piece of black_uniq_pieces ){
    content += '<img src="image/min_'+'B'+piece+'.png" height="'+img_size+'px"></img>';
  }
  div_black_uniq.innerHTML = content;
}

function get_remaining_pieces( chessboard,player ){
  let x,y;
  let chess_array = ['K','Q','R','B','N','P'];
  let pieces = [];
  let tmp_array = [];
  for( y=0;y<dim;y++ ){
    for( x=0;x<dim;x++ ){
      if( chessboard[y][x][0] == player )
        tmp_array.push(chessboard[y][x][1]);
    }
  }
  for( piece of chess_array ){
    for( player_piece of tmp_array ){
      if( player_piece == piece )
        pieces.push(piece);
    }
  }
  return pieces;
}

function get_uniq_chess_pieces(array1,array2){
  let pieces1 = [];
  let pieces2 = [];
  let i,j;
  pieces1 = Array.from(array1);
  pieces2 = Array.from(array2);
  for( i=0;i<pieces1.length;i++ ){
    for( j=0;j<pieces2.length;j++ ){
      if( pieces1[i] == pieces2[j] ){
        pieces1.splice(i,1);
        pieces2.splice(j,1);
        i--;
        break;
      }
    }
  }
  return pieces1;
}

// functions for arrows ( keyboard ) control
function switch_control_by_arrows( checkbox ){
  if( checkbox.checked == true ){
		arrow_control_switch = 1;
		if( player == 'W' ){
			if( arrow_last_white_position == null )
				arrow_current_position = 'A1';
			else
				arrow_current_position = arrow_last_white_position;
		}
		else if( player == 'B' ){
			if( arrow_last_black_position == null )
				arrow_current_position = 'A8';
			else
				arrow_current_position = arrow_last_black_position;
		}
		if( arrow_last_white_position == null )
			arrow_last_white_position = 'A1';
		if( arrow_last_black_position == null )
			arrow_last_black_position = 'A8';
		arrow_current_position_previous_color = document.getElementById(arrow_current_position).style.backgroundColor;
		show_arrow_color_over_field();
  }
  else{
		arrow_control_switch = 0;
		clear_arrow_position();
  }
}

function clear_arrow_position(){
	if( arrow_current_position == null )
		return 0;
	//if( arrow_current_position_previous_color != '' )
	document.getElementById(arrow_current_position).style.backgroundColor = arrow_current_position_previous_color;
}

function show_arrow_color_over_field(){
	if( arrow_current_position == null )
		return 0;
  arrow_current_position_previous_color = document.getElementById(arrow_current_position).style.backgroundColor;
  //console.log("color: "+arrow_div.style.backgroundColor );
  if( arrow_current_position_previous_color === undefined || arrow_current_position_previous_color == null || arrow_current_position_previous_color == '' || arrow_current_position_previous_color == arrow_current_position_color || arrow_current_position_previous_color == field_sign_color )
    arrow_current_position_previous_color = get_field_color(arrow_current_position);
	if( document.getElementById(arrow_current_position).style.backgroundColor != field_sign_color )
		document.getElementById(arrow_current_position).style.backgroundColor = arrow_current_position_color;
}

function keycontrol(event){
  //const key = event.keyCode;
	if( arrow_control_switch == 0 || arrow_current_position == null )
		return 0;
  const key = event.key;
  switch( key ){
    case 'Enter':
      on_enter();
      break;
    case 'ArrowLeft':
      on_arrow('left');
      break;
    case 'ArrowUp':
      on_arrow('up');
      break;
    case 'ArrowRight':
      on_arrow('right');
      break;
    case 'ArrowDown':
      on_arrow('down');
      break;
  }
/* for keyCode
  switch( key ){
    case 13:
      //console.log("ENTER");
      break;
    case 37:
      //console.log("left");
    case 38:
      //console.log("up");
    case 39:
      //console.log("right");
    case 40:
      //console.log("down");
  }
*/
}

function on_arrow(arrow){
	let x = map_letter_to_int(arrow_current_position[0]);
	let y = arrow_current_position[1];
  let arrow_div = document.getElementById(String(arrow_current_position));
  //console.log(arrow_current_position_previous_color);
  if( arrow_div.style.backgroundColor != field_sign_color ){
    if( click == 0 && arrow_current_position_previous_color == possible_move_show_color )
      arrow_current_position_previous_color = get_field_color(arrow_current_position);
    arrow_div.style.backgroundColor = arrow_current_position_previous_color;
  }
	if( flip_view == 'W' ){
		switch(arrow){
			case 'up':
				if( y < dim )
					y++;
				else
					y = 1;
				arrow_current_position = arrow_current_position.replaceAt(1,String(y));
				break;
			case 'down':
				if( y > 1 )
					y--;
				else
					y = dim;
				arrow_current_position = arrow_current_position.replaceAt(1,String(y));
				break;
			case 'left':
				if( x > 1 )
					x--;
				else
					x = dim;
				x=map_int_to_letter(x);
				arrow_current_position = arrow_current_position.replaceAt(0,x);
				break;
			case 'right':
				if( x < dim )
					x++;
				else
					x = 1;
				x=map_int_to_letter(x);
				arrow_current_position = arrow_current_position.replaceAt(0,x);
				break;
		}
	}
	else if( flip_view == 'B' ){
		switch(arrow){
			case 'up':
				if( y > 1 )
					y--;
				else
					y = dim;
				arrow_current_position = arrow_current_position.replaceAt(1,String(y));
				break;
			case 'down':
				if( y < dim )
					y++;
				else
					y = 1;
				arrow_current_position = arrow_current_position.replaceAt(1,String(y));
				break;
			case 'left':
				if( x < dim )
					x++;
				else
					x = 1;
				x=map_int_to_letter(x);
				arrow_current_position = arrow_current_position.replaceAt(0,x);
				break;
			case 'right':
				if( x > 1 )
					x--;
				else
					x = dim;
				x=map_int_to_letter(x);
				arrow_current_position = arrow_current_position.replaceAt(0,x);
				break;
		}
	}
	if( player == 'W' )
		arrow_last_white_position = arrow_current_position;
	else if( player == 'B' )
		arrow_last_black_position = arrow_current_position;
	show_arrow_color_over_field();
	//current_coords = get_board_index( arrow_current_position);
}

function map_letter_to_int(letter){
	for( let i=0;i<letters.length;i++ ){
		if( letters[i] == letter ){
			return (i+1);
		}
	}
	return 0;
}

function map_int_to_letter(number){
	if( number < 1 )
		return 0;
	return letters[number-1];
}

function on_enter(){
	click_chessfield(arrow_current_position,get_field_value(board,arrow_current_position) );
}

// functions for moves history

function render_moves_history( current_move=-1 ){
  let count = 1;
  let history_field = document.getElementById("moves_history");
  let history = '';
  let i;
  if( current_move == -1 ){
    current_move = moves.length-1;
  }
  for( i=0;i<moves.length;i++ ){
    if( i % 2 == 0 ){
      if( count != 1 )
        history += '  |  ';
      history += ('<b>'+count+'.</b> W ');
    }
    else{
      history += ' B ';
    }
    if( i == current_move )
      history += '<span style="background-color:green;" onclick="back_to_move('+i+')">'+moves[i]+'</span> ';
    else
      history += '<span onclick="back_to_move('+i+')">'+moves[i]+'</span> ';
    if( i % 2 != 0 )
      count++;
  }
  history_field.innerHTML = history;
  history_field.scrollTop = history_field.scrollHeight;
}

function back_to_move( move_number ){
  let chessboard = new Array(dim).fill(null).map(()=>new Array(dim).fill(null));
  let move,move_from,move_to;
  let i;
  if( game_with_computer > 0 )
    return 0;
  if( current_move_change == 0 && move_number == moves.length-1 )
    return 0;
  reset_current_game_vars();
  deploy_figures(chessboard);
  for( i=0;i<=move_number;i++ ){
    move = moves[i];
    move_from = move.substr(0,2);
    move_to = move.substr(3,2);
    pawn_promotion_check = 0;
    if( move.substr(6,1) )
      pawn_promotion_piece = move.substr(6,1);
    update_chessboard( chessboard,move_from,move_to );
/*
    clicked_field='';
    clicked_field_value='';
    clicked_field_id='';
*/
  }
  board = chessboard;
  current_move_change = 1;
  current_move_global = move_number;
  //render_chessboard();
  if( i % 2 == 0 )
    player = 'W';
  else
    player = 'B';
  if(auto_flip_view == 1)
    flip_view = player;
  render_field_signs();
  render_chessboard();
  render_moves_history( move_number );
}

// functions to reinitialize vars
// do weryfikacji
function reinitialize_vars() {
  moves = [];
  clicked_field='';
  clicked_field_value='';
  clicked_field_id='';
  field_color;
  click = 0;
  is_game_on = 0;
  is_game_finished = 0;
  pawn_promotion_check = 0;
  pawn_promotion_piece='';
  current_move_piece='';
  current_move_from='';
  current_move_to='';
  //medieval_moves = 1;
  //castling = 1;
  //en_passant = 1;
  check_if_king_moved = { W:0,B:0 };
  check_if_first_rook_moved = { W:0,B:0 };
  check_if_second_rook_moved = { W:0,B:0 };
  current_move_change = 0;
  if( auto_flip_view == 1 )
    flip_view = 'W';
  arrow_last_white_position = 'A1';
  arrow_last_black_position = 'A8';
  arrow_current_position = 'A1';
	document.getElementById("pawn-promotion-field").innerHTML = '';
  document.getElementById("special-moves-check").disabled = false;
  document.getElementById("castling-check").disabled = false;
  document.getElementById("en_passant-check").disabled = false;
}
// do weryfikacji
function reset_current_game_vars(){
  //player = 'W';
  clicked_field='';
  clicked_field_value='';
  clicked_field_id='';
  field_color;
  click = 0;
  is_game_finished = 0;
  pawn_promotion_check = 0;
  pawn_promotion_piece='';
  current_move_piece='';
  current_move_from='';
  current_move_to='';
  check_if_king_moved = { W:0,B:0 };
  check_if_first_rook_moved = { W:0,B:0 };
  check_if_second_rook_moved = { W:0,B:0 };
	document.getElementById("pawn-promotion-field").innerHTML = '';
}

// function to control CSS in window resize
// porpawa tego 100 na pałę!
function set_board_dimensions(){
	let height = window.innerHeight;
	let width = window.innerWidth;
	let right_panel = document.getElementById("right-side");
  let left_panel = document.getElementById("left-side");
	let options_main = document.getElementById("options-main");
	let empty_top_field = document.getElementById("above-board");
  let notifications_current_game = document.getElementById("notifications-current-game");
  let pawn_promotion_field = document.getElementById("pawn-promotion-field");
	let chessboard = document.getElementById("board");
	let numbers = document.getElementById("numbers");
	let letters = document.getElementById("letters");
  let user_panel = document.getElementById("user-panel");
  let game_options = document.getElementById("game-options");
  let game_options_buttons = document.getElementById("game-options-buttons");
  let game_options_checks = document.getElementById("game-options-checks");
  let computer_game_options = document.getElementById("computer-game-options");
  let figures_remaining= document.getElementById("figures-remaining");
  let figures_remaining_title = document.getElementById("figures-remaining-title");
	let figures_remaining_img = document.getElementById("figures-remaining-img");
  let white_figures = document.getElementById("white-figures");
  let black_figures = document.getElementById("black-figures");
  let moves_history = document.getElementById("moves_history");
  let figures_material = document.getElementById("figures-material");
	let figures_material_img = document.getElementById("figures-material-img");
  let moves_history_panel = document.getElementById("moves_history_panel");
	let chessboard_side;
	let side;
  chessboard_side = parseInt(0.8*height);
  // novelty
  while( ( chessboard_side % dim ) != 0 ){
    chessboard_side++;
  }
  // novelty END
  if( width < (2 * chessboard_side) ){
    chessboard_side = parseInt(0.45*width);
    if( chessboard_side > (0.8*height) )
      chessboard_side = parseInt(0.8*height);
  }
	side=parseInt(chessboard_side/dim);
  square_side = side;
	chessboard.style.height = chessboard_side;
	chessboard.style.width = chessboard_side;
	numbers.style.height = chessboard_side;
  numbers.style.width = parseInt(0.5*side);
  numbers.style.fontSize = parseInt(side/2);
  notifications_current_game.style.width = chessboard_side + parseInt(0.5*side)+4;
	letters.style.width = chessboard_side;
  letters.style.height = parseInt(0.5*side);
  letters.style.fontSize = parseInt(side/2);
  empty_top_field.style.height = side;
  options_main.style.height = side;
  pawn_promotion_field.style.height = parseInt(0.85*side);
  pawn_promotion_field.style.marginLeft = parseInt(0.5*side);
  pawn_promotion_field.style.fontSize = parseInt(0.5*side);
  pawn_promotion_field_image_size = parseInt(0.8*side);
  letters.style.marginLeft = (parseInt(0.5*side)+2);
  left_panel.style.width = parseInt(chessboard_side + numbers.offsetWidth + 10);
  user_panel.style.height = chessboard_side;
  game_options.style.height = parseInt(3*side);
  game_options.style.minHeight = parseInt(3*side);
  game_options.style.maxHeight = parseInt(3*side);
  moves_history.style.height = parseInt(parseInt(2.5*side));
  moves_history.style.maxHeight = parseInt(parseInt(2.5*side));
  game_options_buttons.style.height = parseInt(2.25*side);
  game_options_buttons.style.maxHeight = parseInt(2.25*side);
  game_options_checks.style.height = parseInt(2.25*side)
  game_options_checks.style.maxHeight = parseInt(2.25*side)
  computer_game_options.style.height = parseInt( 0.5*side);
  figures_remaining.style.height = 1.25*side;
  figures_remaining_img.style.height = side;
  figures_material.style.height = 1.25*side;
  figures_material_img.style.height = side;

  if( (width - (chessboard_side + numbers.offsetWidth + 100) ) > chessboard_side ){
    right_panel.style.maxWidth = (width - (chessboard_side + numbers.offsetWidth + 150) );
    moves_history.style.width = (width - (chessboard_side + numbers.offsetWidth + 150) );
  }
  else{
    right_panel.style.maxWidth = width - ( left_panel.offsetWidth +100 );
    moves_history.style.width = width - ( left_panel.offsetWidth +100 );
  }
  game_options.style.maxHeight = parseInt(2.5*side);
  moves_history.style.width = game_options.offsetWidth;
  if( pawn_promotion_check == 1 ){
      for( let image of document.querySelectorAll("#pawn-promotion-field img") ){
        //console.log( i );
        if( image.id == 'promotion-piece-cancel' )
          continue;
        image.style.height = pawn_promotion_field_image_size+'px';
        image.style.width = pawn_promotion_field_image_size+'px';
      }
     document.querySelector("#promotion-piece-cancel img").style.height = (0.8*pawn_promotion_field_image_size)+'px';
     document.querySelector("#promotion-piece-cancel img").style.width = (0.8*pawn_promotion_field_image_size)+'px';
    // pawn_promotion_field_image_size
  }

  generate_board();
  //show_remaining_pieces();
}

// Additional/debugging functions

function console_log_board( chessboard ) {
	let row='';
	for( let i = 0 ; i < dim ; i++ ){
		for( let j = 0 ; j < dim ; j++ ){
			row+=chessboard[i][j]+',';
		}
		console.log(row);
		row='';
	}
}

function change_board_situation( chessboard ){
	let y,x;
	for( y=0;y<dim;y++ ){
		for( x=0;x<dim;x++ ){
			board[y][x] = chessboard[y][x];
		}
	}
	generate_board();
}

// FUNCTIONS for the FUTURE

function export_history(){
    let filename = 'test.html';
    var elHtml = document.getElementById("moves_history").innerHTML;
    var link = document.createElement('a');
    let mimeType = 'text/plain';

    link.setAttribute('download', filename);
    link.setAttribute('href', 'data:' + mimeType  +  ';charset=utf-8,' + encodeURIComponent(elHtml));
    link.click();
}
