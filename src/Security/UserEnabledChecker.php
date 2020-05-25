<?php


namespace App\Security;


use App\Entity\User;
use Symfony\Component\Security\Core\Exception\AccountStatusException;
use Symfony\Component\Security\Core\Exception\DisabledException;
use Symfony\Component\Security\Core\User\UserCheckerInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class UserEnabledChecker implements UserCheckerInterface
{

    /**
     * @param UserInterface $user
     * @return mixed
     */
    public function checkPreAuth(UserInterface $user)
    {
        if (!$user instanceof User) {
            return;
        }

        if (!$user->getIsActive()) {
            throw new DisabledException("Votre compte est désactivé.");
        }
    }

    /**
     * @param UserInterface $user
     * @return mixed
     */
    public function checkPostAuth(UserInterface $user)
    {
    }
}
