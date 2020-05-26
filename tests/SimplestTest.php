<?php


namespace App\Tests;


use PHPUnit\Framework\TestCase;

class SimplestTest extends TestCase
{
    public function testAddition()
    {
        $value= true;
        $array = [
            "key"=>"value"
        ];

        $this->assertEquals(5, 2 + 3, '5 est bien le resultat de 2+3');
        $this->assertTrue($value);
        $this->assertArrayHasKey('key', $array);
    }
}
