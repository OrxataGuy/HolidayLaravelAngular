<?php

namespace App\Auth\Model;

use App\Models\User;
use Lcobucci\JWT\Encoding\ChainedFormatter;
use Lcobucci\JWT\Encoding\JoseEncoder;
use Laravel\Passport\Bridge\AccessToken as PassportAccessToken;
use Lcobucci\JWT\Token\Builder;
use Lcobucci\JWT\Signer\Key\InMemory;
use Lcobucci\JWT\Signer\Rsa\Sha256;
use League\OAuth2\Server\CryptKey;
use DateTimeImmutable;

class AccessToken extends PassportAccessToken
{

    private $privateKey;

    public function convertToJWT(CryptKey $privateKey)
    {
        $builder = new Builder(new JoseEncoder(), ChainedFormatter::default());
        $now = new DateTimeImmutable();
        $user = User::find($this->getUserIdentifier());
        $builder->permittedFor($this->getClient()->getIdentifier())
            ->identifiedBy($this->getIdentifier(), true)
            ->issuedAt($now)
            ->canOnlyBeUsedAfter($now)
            ->expiresAt($now->modify('+1 hour'))
            ->relatedTo($this->getUserIdentifier())
            ->withClaim('scopes', [])
            ->withClaim('id', $user->id)
            ->withClaim('name', $user->name)
            ->withClaim('power', $user->getPower());

        return $builder
            ->getToken(new Sha256(), InMemory::file($privateKey->getKeyPath()))->toString();//new InMemory($privateKey->getKeyPath(), $privateKey->getPassPhrase()))->toString();
    }

    public function setPrivateKey(CryptKey $privateKey)
    {
        $this->privateKey = $privateKey;
    }

    public function __toString()
    {
        return (string) $this->convertToJWT($this->privateKey);
    }

}
