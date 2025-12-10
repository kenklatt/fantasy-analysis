{
  description = "ESPN Fantasy Football API project";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_20
            nodePackages.npm
          ];

          shellHook = ''
            echo "ESPN Fantasy Football API Development Environment"
            echo "Node version: $(node --version)"
            echo "NPM version: $(npm --version)"
            echo ""
            echo "Run 'npm install' to install dependencies"
            echo "Run 'node src/index.js' to run the example"
          '';
        };

        packages.default = pkgs.stdenv.mkDerivation {
          pname = "espn-fantasy-analysis";
          version = "0.1.0";
          src = ./.;

          buildInputs = [ pkgs.nodejs_20 ];

          buildPhase = ''
            npm install
          '';

          installPhase = ''
            mkdir -p $out/bin
            cp -r . $out/
            echo '#!/bin/sh' > $out/bin/fantasy-analysis
            echo "cd $out && ${pkgs.nodejs_20}/bin/node src/index.js" >> $out/bin/fantasy-analysis
            chmod +x $out/bin/fantasy-analysis
          '';
        };
      }
    );
}
