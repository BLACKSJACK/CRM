<?
    //ini_set('display_errors',1);
	//error_reporting(E_ALL);
	header("Content-Type: text/html; charset=utf-8");
	include_once('db_connect.php');

	$answer = json_decode(file_get_contents('php://input'), true);
	echo json_encode($answer);

?>