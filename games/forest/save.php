<?php
        echo "Saving...";
        $q = $_REQUEST["q"];
        $xml = fopen("stats.xml","r+") or exit("unable to find file");
        fwrite($xml,$q);
        fclose($xml);
        echo "Save complete";
?>
