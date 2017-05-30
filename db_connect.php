<?php

$host="92.53.114.76:3306";
$user="cm52806_calcgr";
$password="A2hF9eSaDg76FnS5D";
$db="cm52806_calcgr";
mysql_connect($host, $user, $password) or die("MySQL сервер недоступен!".mysql_error());
mysql_select_db($db) or die("Нет соединения с БД".mysql_error());

if(isset($_GET['server_root'])){$server_root = $_GET['server_root'];unset($server_root);}
if(isset($_POST['server_root'])){$server_root = $_POST['server_root'];unset($server_root);}

$server_root = "http://capitalpolis.ru";

$link=mysql_connect($host,$user,$password);
mysql_select_db($db,$link);


?>