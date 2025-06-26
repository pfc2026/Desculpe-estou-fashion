<?php
 $insert = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
 $stmt = $sql->prepare($insert);