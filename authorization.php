<?
    ini_set('display_errors',1);

    header("Content-Type: text/html; charset=utf-8");
    include_once('db_connect.php');

	$data = json_decode(file_get_contents('php://input'), true);
    if (isset($data['pwd']) && isset($data['login'])){
        $query = "SELECT * FROM users";
        $result = mysql_query($query) or die();
        while($row=mysql_fetch_array($result)){
            if($row['LOGIN']===$data['login'] && $row['PWD']===$data['pwd']){
                $answer['name']= $row['NAME'];
                $answer['options']=$row['OPTIONS'];


            }
        }
        if(!isset($answer))  $answer="permission denied";
    }
    echo json_encode($answer);

?>