<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script src="./js/app.js" defer></script>
        <link href="./css/app.css" rel="stylesheet">
        <title>Poker Hands</title>
    </head>
    <body class="antialiased">
        <div id="app">
 <?php
$players = [
    (object)[
        "id" => 123321,
        "name" => "white",
        "hand" => [],
    ],
    (object)[
        "id" => 987789,
        "name" => "black",
        "hand" => [],
    ],
    (object)[
        "id" => 678876,
        "name" => "red",
        "hand" => [],
    ],
    // (object)[
    //     "id" => 987765,
    //     "name" => "blues",
    //     "hand" => [],
    // ],
];?>
            <poker-hands :player-items='<?= json_encode($players) ?>'></poker-hands>
        </div>
    </body>
</html>
