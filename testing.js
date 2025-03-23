// testing functions

function get_position( position,player='W',mate_type=1 ){
	reinitialize_vars();
	switch( position ){
		case 'mate':
			get_mate_position(player,mate_type);
			break;
		case 'before_mate':
			get_before_mate_position(player,mate_type);
			break;
		case 'draw':
			get_draw_position();
			break;
		case 'before_draw':
			get_before_draw_position();
			break;
		case 'stalemate':
			get_before_stalemate_position( player );
			break;
		case 'castling':
			get_castling_position();
			break;
		case 'promotion':
			get_pawn_promotion_position( player );
			break;
		case 'en_passant':
			get_pawn_en_passant_position( player );
			break;
	}
}

function get_before_mate_position( mating_player,mate_type=1 ){
	let white_board_1 = [
			['','','','','BK','','','',],
			['','','','','','','','WR',],
			['','','','','','','','',],
			['','','','','','','','',],
			['','','','','','','','',],
			['WQ','','','','','','','',],
			['','','','','','','','',],
			['','','','','WK','','','',]
	];
	let white_board_2 = [
			['BR','','','','','BR','BK','',],
			['','','','','','','BP','',],
			['BQ','','','','','','','',],
			['','','','WN','','','','',],
			['','','','','','','','',],
			['','WB','','','','','','WR',],
			['','','','','','','','',],
			['','','','','','','WK','',]
	];
	let black_board_1 = [
			['','','','','BK','','','',],
			['','','','','','','','',],
			['','','','','','','','',],
			['','','','','','','','',],
			['','','BB','','','','','',],
			['','','','','','','','',],
			['','','','','','','','BQ',],
			['','','','','WK','','','',]
	];
	let black_board_2 = [
			['','','','','','','BK','',],
			['','','','','','','BP','BR',],
			['','BB','','','','','','',],
			['','','','','','','','',],
			['','','','BN','','','','',],
			['','','','','','','','',],
			['','','','','','','WP','',],
			['WR','WN','','','','WR','WK','',]
	];

	if( mating_player == 'W' ){
		if( mate_type == 1 )
			change_board_situation( white_board_1 );
		if( mate_type == 2 )
			change_board_situation( white_board_2 );
		player = 'W';
	}
	if( mating_player == 'B' ){
		if( mate_type == 1 )
			change_board_situation( black_board_1 );
		if( mate_type == 2 )
			change_board_situation( black_board_2 );
		player = 'B';
	}
}

function get_mate_position( mating_player,mate_type=1 ){
	let white_board_1 = [
			['','','','','BK','','','',],
			['','','','','WQ','','','WR',],
			['','','','','','','','',],
			['','','','','','','','',],
			['','','','','','','','',],
			['','','','','','','','',],
			['','','','','','','','',],
			['','','','','WK','','','',]
	];
	let white_board_2 = [
			['BR','','','','','BR','BK','',],
			['','','','','WN','','BP','',],
			['BQ','','','','','','','',],
			['','','','','','','','',],
			['','','','','','','','',],
			['','WB','','','','','','WR',],
			['','','','','','','','',],
			['','','','','','','WK','',]
	];
	let black_board_1 = [
			['','','','','BK','','','',],
			['','','','','','','','',],
			['','','','','','','','',],
			['','','','','','','','',],
			['','','BB','','','','','',],
			['','','','','','','','',],
			['','','','','BQ','','','',],
			['','','','','WK','','','',]
	];
	let black_board_2 = [
			['','','','','','','BK','',],
			['','','','','','','BP','BR',],
			['','BB','','','','','','',],
			['','','','','','','','',],
			['','','','','','','','',],
			['','','','','','BN','','',],
			['','','','','','','WP','',],
			['WR','WN','','','','WR','WK','',]
	];
	if( mating_player == 'W' ){
		player = 'B';
		if( mate_type == 1 )
			change_board_situation( white_board_1 );
		if( mate_type == 2 )
			change_board_situation( white_board_2 );
	}
	if( mating_player == 'B' ){
		player = 'W';
		if( mate_type == 1 )
			change_board_situation( black_board_1 );
		if( mate_type == 2 )
			change_board_situation( black_board_2 );
	}
}

function get_before_draw_position(){
	let board_1 = [
			['','','','','BK','','','',],
			['','','','','','','','',],
			['','','','','','','','',],
			['','','','','BN','','','',],
			['','','','','','','','',],
			['','','','','','','','',],
			['','','','','WB','','BP','',],
			['','','','','','','WK','',]
	];
		change_board_situation( board_1 );
		player = 'W';
}

function get_draw_position(){
	let board_1 = [
			['','','','','BK','','','',],
			['','','','','','','','',],
			['','','','','','','','',],
			['','','','','WN','','','',],
			['','','','','','','','',],
			['','','','','','','','',],
			['','','','','BB','','','',],
			['','','','','','','WK','',]
	];
	change_board_situation( board_1 );
}

function get_before_stalemate_position ( stalemate_for_player ){
	let white_board_1 = [
			['','','','','BK','','','',],
			['','','','','','','','',],
			['','','','','','','','',],
			['','','','','','','','',],
			['','','','','','','','',],
			['','','','','','','','',],
			['','','','','BQ','','','',],
			['','','','','','','WK','',]
	];
	let black_board_1 = [
			['','','','','','','BK','',],
			['','','','','WQ','','','',],
			['','','','','','','','',],
			['','','','','','','','',],
			['','','','','','','','',],
			['','','','','','','','',],
			['','','','','','','','',],
			['','','','','WK','','','',]
	];
	if( stalemate_for_player == 'W' ){
		change_board_situation( white_board_1 );
		player = 'W';
	}
	if( stalemate_for_player == 'B' ){
		change_board_situation( black_board_1 );
		player = 'B';
	}
}

function get_pawn_promotion_position ( promotion_player ){
	let white_board = [
			['','BN','BB','','BK','BB','','BR',],
			['WP','BP','BP','BP','BP','','WP','',],
			['','','','','','','','WP',],
			['','','','','','','','',],
			['','','','','','','','',],
			['','','','','','','','',],
			['','WP','WP','WP','WP','WP','','',],
			['WR','WN','WB','WQ','WK','WB','WN','WR',]
	];
	let black_board = [
			['BR','','BB','','BK','BB','','BR',],
			['','BP','BP','BP','BP','','','',],
			['','','','','','','','',],
			['','','','','','','','',],
			['','','','','','','','',],
			['','','','','','','','BP',],
			['BP','WP','WP','WP','WP','WP','BP','',],
			['','WN','WB','WQ','WK','WB','','WR',]
	];
	if( promotion_player == 'W' ){
		change_board_situation( white_board );
		player = 'W';
	}
	if( promotion_player == 'B' ){
		change_board_situation( black_board );
		player = 'B';
	}
}

function get_castling_position(){
	let board_1 = [
			['BR','','','','BK','','','BR',],
			['BP','BP','BP','BQ','BB','BP','BP','BP',],
			['','','BN','','BP','BN','','',],
			['','','','BP','','BB','','',],
			['','','WB','WP','','WB','','',],
			['','','WN','','','WN','','',],
			['WP','WP','WP','WQ','WP','','WP','',],
			['WR','','','','WK','','','WR',]
	];
		change_board_situation( board_1 );
		player = 'W';
}

function get_pawn_en_passant_position ( executing_player ){
	let white_board_1 = [
			['BR','BN','BB','BQ','BK','BB','BN','BR',],
			['BP','BP','BP','BP','BP','BP','BP','BP',],
			['','','','','','','','',],
			['WP','','','WP','','WP','','WP',],
			['','','','','','','','',],
			['','','','','','','','',],
			['','WP','WP','','WP','','WP','',],
			['WR','WN','WB','WQ','WK','WB','WN','WR',]
	];
	let white_board_2 = [
			['BR','BN','BB','BQ','BK','BB','BN','BR',],
			['BP','BP','BP','BP','','BP','BP','BP',],
			['','','','','','','','',],
			['WP','','','WP','BP','WP','','WP',],
			['','','','','','','','',],
			['','','','','','','','',],
			['','WP','WP','','WP','','WP','',],
			['WR','WN','WB','WQ','WK','WB','WN','WR',]
	];
	let black_board_1 = [
			['BR','BN','BB','BQ','BK','BB','BN','BR',],
			['','BP','BP','','BP','','BP','',],
			['','','','','','','','',],
			['','','','','','','','',],
			['BP','','','BP','','BP','','BP',],
			['','','','','','','','',],
			['WP','WP','WP','WP','WP','WP','WP','WP',],
			['WR','WN','WB','WQ','WK','WB','WN','WR',]
	];
	let black_board_2 = [
			['BR','BN','BB','BQ','BK','BB','BN','BR',],
			['','BP','BP','','BP','','BP','',],
			['','','','','','','','',],
			['','','','','','','','',],
			['BP','','','BP','WP','BP','','BP',],
			['','','','','','','','',],
			['WP','WP','WP','WP','','WP','WP','WP',],
			['WR','WN','WB','WQ','WK','WB','WN','WR',]
	];
	if( executing_player == 'W' ){
		change_board_situation( white_board_1 );
		is_game_finished = 1;
		setTimeout(function(){ change_board_situation( white_board_2 ) }, 1000);
		current_move_piece = 'BP';
		current_move_from = 'E7';
		current_move_to = 'E5';
		is_game_finished = 0;
		player = 'W';
	}
	if( executing_player == 'B' ){
		change_board_situation( black_board_1 );
		is_game_finished = 1;
		setTimeout(function(){ change_board_situation( black_board_2 ) }, 1000);
		current_move_piece = 'WP';
		current_move_from = 'E2';
		current_move_to = 'E4';
		is_game_finished = 0;
		player = 'B';
	}
}
