<?php

namespace App\Repository;

use App\Entity\Post;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Post|null find($id, $lockMode = null, $lockVersion = null)
 * @method Post|null findOneBy(array $criteria, array $orderBy = null)
 * @method Post[]    findAll()
 * @method Post[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PostRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Post::class);
    }

    public function getPostFeelingAngryByUser(User $user)
    {
        $query = $this->createQueryBuilder('p')
            ->select('p')
            ->leftJoin('p.feelingAngry', 'fa')
            ->addSelect('fa');

        $query = $query->add('where', $query->expr()->in('fa', ':fa'))
            ->setParameter('fa', $user)
            ->getQuery()
            ->getResult();

        return $query;


    }

    public function getPostFeelingBoredByUser(User $user)
    {
        $query = $this->createQueryBuilder('p')
            ->select('p')
            ->leftJoin('p.feelingBored', 'fa')
            ->addSelect('fa');

        $query = $query->add('where', $query->expr()->in('fa', ':fa'))
            ->setParameter('fa', $user)
            ->getQuery()
            ->getResult();

        return $query;
    }

    public function getPostFeelingSillyByUser(User $user)
    {
        $query = $this->createQueryBuilder('p')
            ->select('p')
            ->leftJoin('p.feelingSilly', 'fa')
            ->addSelect('fa');

        $query = $query->add('where', $query->expr()->in('fa', ':fa'))
            ->setParameter('fa', $user)
            ->getQuery()
            ->getResult();

        return $query;
    }

    public function getPostFeelingScaryByUser(User $user)
    {
        $query = $this->createQueryBuilder('p')
            ->select('p')
            ->leftJoin('p.feelingScary', 'fa')
            ->addSelect('fa');

        $query = $query->add('where', $query->expr()->in('fa', ':fa'))
            ->setParameter('fa', $user)
            ->getQuery()
            ->getResult();

        return $query;
    }

}
