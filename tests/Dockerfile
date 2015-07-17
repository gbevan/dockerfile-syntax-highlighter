FROM ABC

# Build:
#  docker build -t gbevan/meanio .
#
# Run:
#

FROM ubuntu:latest
MAINTAINER Your name "you@example.com"

ENV DEBIAN_FRONTEND noninteractive # comment
ENV LANG=C
ENV LC_ALL=C
ENV ABC=123 DEF=567
ENV GHI="data spaces" JKL="uck"   # commentx

# Dependencies
RUN \
    apt-get -yq update && \
    apt-get dist-upgrade -yq && \
    apt-get install -yqq wget aptitude htop vim vim-puppet git traceroute dnsutils \
      curl ssh sudo psmisc gcc make build-essential libfreetype6 libfontconfig \
      augeas-tools tree tcpdump && \
    mkdir /var/run/sshd && \
    sed -ri 's/UsePAM yes/#UsePAM yes/g' /etc/ssh/sshd_config && \
    sed -ri 's/#UsePAM no/UsePAM no/g' /etc/ssh/sshd_config && \
    useradd --create-home -s /bin/bash mean && \
    su - mean -c "mkdir -p .ssh; chmod 700 .ssh" && \
    echo -n "mean:`openssl rand -base64 15`" | chpasswd && \
    su - mean -c "touch .hushlogin" && \
    mkdir -p /etc/sudoers.d && \
    echo "mean ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/mean && \
    chmod 0440 /etc/sudoers.d/mean && \
    echo "set modeline" > /etc/vim/vimrc.local && \
    echo "export TERM=vt100\nexport LANG=C\nexport LC_ALL=C" > /etc/profile.d/dockenv.sh && \
    apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

    # comment

# Mongodb & mean-cli
RUN \
    echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' > /etc/apt/sources.list.d/mongodb.list && \
    apt-get -yq update && \
    apt-get install -yqq mongodb-org && \
    curl -sL https://deb.nodesource.com/setup | sudo bash - && \
    apt-get -yq update && \
    apt-get install -yqq nodejs && \
    apt-get clean && \
    npm install -g grunt-cli && \
    npm install -g gulp && \
    npm install -g karma-cli && \
    npm install -g mocha && \
    npm install -g bower && \
    npm install -g mean-cli@0.9.21 && \
    npm install -g forever && \
    npm cache clean && \
    rm -rf /var/lib/mongodb/* /var/lib/apt/lists/* /tmp/* /var/tmp/*

    # comment

# App init
RUN \
    /usr/bin/mongod --config /etc/mongod.conf --fork --smallfiles && \
    echo "export MONGOOSE_DISABLE_STABILITY_WARNING=1" >> ~/.bashrc && \
    export MONGOOSE_DISABLE_STABILITY_WARNING=1 && \
    su - mean -c'mkdir -p .npm; echo -e "\n\n \n" | mean init --branch v0.4.2 appserver && cd appserver && sed -i "s/\\(mongoose.:.*\\)^3\\.8\\.8\\(.*\\)/\13.8\2/" package.json && npm install && bower --config.interactive=false install && mean install mean-admin && npm cache clean; bower cache clean' && \
    perl -e 'local $/=undef; open(GR,"</home/mean/appserver/Gruntfile.js"); binmode GR; $F=<GR>; $F=~s/(mochaTest: {.\s*options: {)/$1\n        timeout: 20000,/ms; open(NG, ">/home/mean/appserver/Gruntfile.js"); print NG $F' && \
    su - mean -c'cd appserver && grunt test' && \
    (/usr/bin/mongod --shutdown --config /etc/mongod.conf &) && \
    sleep 5 && \
    (killall mongod 2>/dev/null || true) && sleep 10 && (killall -9 mongod 2>/dev/null || true) && sleep 5 && \
    rm -rf /var/lib/mongodb/* /var/lib/apt/lists/* /tmp/* /var/tmp/*

    # comment

CMD cat /etc/motd
CMD \
  cat /etc/motd; \
  cat /something

  # comment

CMD ["executable", "param1", "param2"]
CMD echo "This is a test." | wc -
  # comment

ADD start-image.sh /

COPY a b
COPY hom* /mydir/

USER daemon

WORKDIR /path/to/workdir

ONBUILD ADD . /app/src
ONBUILD RUN /usr/local/bin/python-build --dir /app/src

VOLUME /myvol
VOLUME ["/data"]
VOLUME /var/log /var/db

#CMD ["/usr/sbin/sshd", "-D", "-e"]
ENTRYPOINT ["/bin/bash", "/start-image.sh"]

EXPOSE 3000 3443

LABEL "abcdfefsdf" = "this is a string" # comment
LABEL 'this is another' = skdfsldkfj
LABEL "this ''''' is a string" = yup
LABEL "this \"
is error"

LABEL "this \
is multiline"

LABEL "this is error
on multiline"

LABELthis is an error and therefore in red
LABEL "com.example.vendor"="ACME Incorporated"
LABEL com.example.label-with-value="foo"
LABEL version="1.0"
LABEL description="This text illustrates \
that label-values can span multiple lines."
LABEL "this is a multiline \
thang" = 'Something'
LABEL "in quotes ====== 'this is in different quotes'
LABEL asd=234 xcvb=456
" = "xyz"
LABEL "LAB1"="VAL1" "LAB2"="VAL2"
    #comment

This is a syntax error - in red
