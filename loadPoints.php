<?
    header("Content-Type: text/html; charset=utf-8");
    include_once('db_connect.php');
    $query="SELECT * FROM new_points ORDER BY x ASC";
    $result = mysql_query($query) or die(mysql_error());
    $resultJson = array();

    while($row=mysql_fetch_array($result, MYSQL_ASSOC)){
       $resultJson[]=$row;
    }
    echo json_encode($resultJson);


?>